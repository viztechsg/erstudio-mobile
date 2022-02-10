import React, { useState, useEffect, useCallback } from "react";
import { Text, StyleSheet, View, TouchableOpacity, Image, ScrollView, RefreshControl, CheckBox, Alert } from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/FontAwesome'
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons'
import generalStyle from '../../general/Styles/generalStyle'
import styles from './styles';
import AppointmentItem from "../../components/Home/AppointmentItem";
import { dashboardData } from "../../services/dashboard";
import { store } from "../../store/store";
import AppointmentUpdateModal from "../../components/AppointmentUpdateModal";
import { Overlay } from 'react-native-elements';
import TextField from '../../components/TextField';
import SelectPicker from '../../components/SelectPicker';
import DefaultButton from '../../components/DefaultButton';
import DatePicker from "../../components/DatePicker";
import { appointmentMinutesOption, appointmentSecondVenue, appointmentTimeOptions } from "../../constants/Appointment";
import { checkVenueAvailability, updateLeadAppointment } from "../../services/lead";
import moment from 'moment-business-time';
import { getNeedAttention, getVenueSource } from "../../services/config";
import api from "../../api/api";
const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const HomeScreen2 = ({ navigation }) => {
    moment.locale('en', {
        workinghours: {
            0: null,
            1: ['08:00:00', '17:00:00'],
            2: ['08:00:00', '17:00:00'],
            3: ['08:00:00', '17:00:00'],
            4: ['08:00:00', '17:00:00'],
            5: ['08:00:00', '17:00:00'],
            6: null
        }
    });

    const [dashboard, setDashboard] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updateModalData, setUpdateModalData] = useState([]);
    const [hour, setHour] = useState("");
    const [minute, setMinute] = useState("");
    const [hourEnd, setHourEnd] = useState("");
    const [minuteEnd, setMinuteEnd] = useState("");
    const [appointmentDataLog, setAppointmentDataLog] = useState([]);
    const [apptVenueOption, setApptVenueOption] = useState([]);
    const [appointmentChildVenue, setAppointmentChildVenue] = useState([]);
    const [needAttentionTotal, setNeedAttentionTotal] = useState(0);
    const [pendingDoc, setPendingDoc] = useState(0);


    const [checkingRule, setCheckingRule] = useState([]);
    const [hourCompare, setHourCompare] = useState("");
    const [hourCompareEnd, setHourCompareEnd] = useState("");
    const [minuteCompare, setMinuteCompare] = useState("");
    const [minuteCompareEnd, setMinuteCompareEnd] = useState("");
    const [venueCompare, setVenueCompare] = useState("");
    const [venueTwoCompare, setVenueTwoCompare] = useState("");
    const [dateCompare, setDateCompare] = useState("");

    useEffect(() => {
        navigation.setParams({
            needAttention: pendingDoc
        });
    }, [pendingDoc]);


    const getAllLead = () => {
        api.get(`/leads`, {
            headers: {
                Authorization: `Bearer ${store.getState().loginReducer.token}`
            }
        })
            .then((data) => {
                setNeedAttentionTotal(countNeedAttention(data.data.data.lead))
            })
            .catch((error) => {
                console.log(error.response);
            })
    }

    const countNeedAttention = (data) => {
        var leadThatExpired = 0;
        var endTime = moment();

        data.map((value, index) => {
            var hours = moment(endTime).workingDiff(moment(value.created_at), 'hours', true);
            if (hours >= 4 && ((value.status == "newlead" || value.status == "reassign") && value.remarks.length < 1)) {
                leadThatExpired++;
            }
        });

        return leadThatExpired;
    };

    useEffect(() => {
        dashboardData().then((data) => data).then(response => { setDashboard(response) }).catch((e) => console.log(e.response))
        getNeedAttention().then((data) => setPendingDoc(data));
        getAllLead();
        getVenueSource().then((data) => {
            setApptVenueOption([]);
            data.data.map((value) => {
                setApptVenueOption((oldValue) => [
                    ...oldValue,
                    { label: value.name, value: value.name, key: value.name, children: value.children }
                ]);
            });
        });
    }, [appointmentDataLog])

    useEffect(() => {
        const interval = setInterval(() => refreshEveryTenSeconds(), 30000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        navigation.addListener('willFocus', () => {
            dashboardData().then((data) => data).then(response => setDashboard(response));
            getNeedAttention().then((data) => setPendingDoc(data)).catch((E) => console.log(E));
            getAllLead();
            getVenueSource().then((data) => {
                setApptVenueOption([]);
                data.data.map((value) => {
                    setApptVenueOption((oldValue) => [
                        ...oldValue,
                        { label: value.name, value: value.name, key: value.name }
                    ]);
                });
            });
        });

    }, [navigation])

    const changeDateStart = useCallback(
        (data) => {
            setHour(data);
            var nextHour = parseInt(data) + 1;
            var newHourEnd = nextHour.toString();

            if(nextHour == 9)
            {
                newHourEnd = "0"+nextHour.toString();
            }

            setHourEnd(newHourEnd);
        },
        [hour],
    )

    // const changeDateStart = (data) => {
        
    // }

    const updateAppointment = async () => {
        if (hour + ":" + minute != hourCompare + ":" + minuteCompare || hourEnd + ":" + minuteEnd != hourCompareEnd + ":" + minuteCompareEnd || venueTwoCompare != updateModalData?.venue_two || venueCompare != updateModalData?.venue || dateCompare != moment(updateModalData?.date, 'DD-MM-YYYY').format('YYYY-MM-DD')) {
            var venueAvailability = await checkVenueAvailability(
                moment(updateModalData?.date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                hour + ":" + minute,
                hourEnd + ":" + minuteEnd,
                updateModalData?.venue,
                updateModalData?.venue_two
            );

            console.log(venueAvailability);

            if (venueAvailability.is_available == false) {

                var msg = "Venue already booked for this range time \n\n";
                venueAvailability.data.map((item, index) => {
                    msg += `Booking Details: \nVenue: ${item.venue_two ? item.venue + '|' + item.venue_two : item.venue}\nDate & Time: ${item.date}, ${item.time} - ${item.time_end}\n\n`
                });

                Alert.alert("Appointment", msg);
                return;
            }
        }

        let appointmentItem = {
            appointmentId: updateModalData?.id,
            name: 'Appointment',
            date: moment(updateModalData?.date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
            venue: updateModalData?.venue,
            time: hour + ":" + minute,
            time_end: hourEnd + ":" + minuteEnd,
            client_name: updateModalData?.client_name,
            sales_name: updateModalData?.sales_name,
            pax: updateModalData?.pax,
            venue_two: updateModalData?.venue_two
        };
        setAppointmentDataLog([...appointmentDataLog, appointmentItem]);
        updateLeadAppointment(appointmentItem)
            .then(setShowUpdateModal(!showUpdateModal))
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        dashboardData().then((data) => data).then(response => setDashboard(response))
        getAllLead();
        wait(3000).then(() => setRefreshing(false))
    }, [refreshing]);

    const refreshEveryTenSeconds = () => {
        setRefreshing(true);
        dashboardData().then((data) => data).then(response => setDashboard(response))
        getAllLead();
        wait(3000).then(() => setRefreshing(false))
    };

    if (!dashboard) return false
    return (
        <View style={generalStyle.bodyContainer} >
            {/* Header */}
            <View style={styles.wrapper}>
                <View style={[styles.item, { alignItems: 'flex-start', width: '20%' }]}>
                    <View style={styles.roundedContainer}>
                        <Image source={{ uri: "https://reactjs.org/logo-og.png" }} style={{ width: 55, height: 55 }} />
                    </View>
                </View>
                <View style={[styles.item, { alignItems: 'flex-start' }]}>
                    <Text style={styles.heading}>{store.getState().loginReducer.name}</Text>
                    <Text style={styles.labelText}>{store.getState().loginReducer.role}</Text>
                </View>
                <View style={[styles.item, { alignItems: 'flex-end' }]}>
                    <TouchableOpacity>
                        <Icon name="ellipsis1" size={40} color='black' />
                    </TouchableOpacity>

                </View>
            </View>
            {/* Card components */}
            <View>
                <ScrollView
                    // scrollEnabled={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    <View style={[styles.wrapper2, { backgroundColor: 'transparent' }]}>
                        <View style={styles.card}>

                            <View style={styles.cardContent}>
                                <Text adjustsFontSizeToFit style={{ fontSize: 16, color: '#FFE605', fontWeight: 'bold' }}>New Leads</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                <View style={{ width: '49%' }} >
                                    <TouchableOpacity style={{ width: '100%' }} key='NEW_LEAD_DIRECT' onPress={() => navigation.navigate('List', { filterStatus: 'newlead', needAttention: 'newlead-noneed' })}>
                                        <Text adjustsFontSizeToFit style={styles.innerWhiteText}>{dashboard?.new_leads ? dashboard?.new_leads : 0}</Text>
                                        <Text adjustsFontSizeToFit style={{ fontSize: 15, color: 'white', }}>Total</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ flexShrink: 1, justifyContent: 'flex-end', width: '49%' }}>
                                    <TouchableOpacity style={{ width: '100%' }} key='NEW_LEAD_DIRECT_NEED_ATTENTION' onPress={() => navigation.navigate('List', { filterStatus: 'newlead', needAttention: 'newlead-need' })}>
                                        <Text adjustsFontSizeToFit style={{ fontSize: 45, color: '#F86D6D' }}>{needAttentionTotal}</Text>
                                        <Text adjustsFontSizeToFit style={{ fontSize: 14, color: '#F86D6D' }}>Need Attention</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>

                        <View style={styles.card}>
                            <TouchableOpacity key='FOLLOW_UP_DIRECT' onPress={() => navigation.navigate('List', { filterStatus: 'followup', needAttention: '' })}>
                                <View style={styles.cardContent}>
                                    <Text adjustsFontSizeToFit style={{ fontSize: 16, color: '#F49C37', fontWeight: 'bold' }}>To Follow Up</Text>
                                </View>
                                <View>
                                    <Text adjustsFontSizeToFit style={styles.innerWhiteText}>{dashboard?.followup_leads}</Text>
                                    <Text adjustsFontSizeToFit style={{ fontSize: 15, color: 'white' }}>Total</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                    </View>
                    <View style={[styles.wrapper2, { backgroundColor: 'transparent' }]}>
                        <View style={styles.card}>
                            <TouchableOpacity key='RETURN_DIRECT' onPress={() => navigation.navigate('List', { filterStatus: '', needAttention: '' })}>
                                <View style={styles.cardContent}>
                                    <Text adjustsFontSizeToFit style={{ fontSize: 16, color: '#B2B2B2', fontWeight: 'bold' }}>Yearly Leads</Text>
                                </View>
                                <View>
                                    <Text adjustsFontSizeToFit style={styles.innerWhiteText}>{dashboard?.return_lead}</Text>
                                    <Text adjustsFontSizeToFit style={{ fontSize: 15, color: 'white' }}>Total</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.card}>
                            <TouchableOpacity key='SUCCESS_DIRECT' onPress={() => navigation.navigate('List', { filterStatus: 'successful', needAttention: '' })}>
                                <View style={styles.cardContent}>
                                    <Text adjustsFontSizeToFit style={{ fontSize: 16, color: '#1DBE16', fontWeight: 'bold' }}>Success Leads</Text>
                                </View>
                                <View>
                                    <Text adjustsFontSizeToFit style={styles.innerWhiteText}>{dashboard?.success_leads}</Text>
                                    <Text adjustsFontSizeToFit style={{ fontSize: 15, color: 'white' }}>Total</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
            {/* Appointment component */}
            <View style={[styles.wrapper2, { backgroundColor: 'transparent', flex: 1 }]}>
                <View style={[styles.card, { width: '99%', padding: 10, borderRadius: 5, height: '100%' }]}>
                    <View>
                        <Text style={{ color: 'white' }}>Appointment</Text>
                    </View>
                    <Overlay
                        isVisible={showUpdateModal}
                        onBackdropPress={() => setShowUpdateModal(!showUpdateModal)}
                        overlayStyle={{ width: '80%', height: 500, paddingBottom: 40 }}>
                        <Text
                            style={
                                { color: 'grey', fontWeight: '800', fontSize: 18 }
                            }>
                            Update Appointment Details
                        </Text>
                        <ScrollView>
                            <DatePicker
                                required={true}
                                label="Date"
                                initialDate={updateModalData?.date ? new Date(moment(updateModalData.date, 'DD-MM-YYYY').format()) : new Date()}
                                selectedDate={new Date(moment(updateModalData.date, 'DD-MM-YYYY').format())}
                                onChange={(data) =>
                                    setUpdateModalData((prevState) => ({ ...prevState, date: data }))
                                }
                            />
                            <View>
                                <Text>Start Time</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: -10 }}>
                                <View style={{ width: '50%' }}>
                                    <SelectPicker
                                        label="Hour"
                                        required={true}
                                        selectedValue={hour}
                                        options={appointmentTimeOptions}
                                        onSelect={(data) => changeDateStart(data)}
                                    />
                                </View>
                                <View style={{ width: '50%' }}>
                                    <SelectPicker
                                        label="Minutes"
                                        required={true}
                                        selectedValue={minute}
                                        options={appointmentMinutesOption}
                                        onSelect={(data) => setMinute(data)}
                                    />
                                </View>
                            </View>

                            <View>
                                <Text>End Time</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: -10 }}>
                                <View style={{ width: '50%' }}>
                                    <SelectPicker
                                        label="Hour"
                                        required={true}
                                        selectedValue={hourEnd}
                                        options={appointmentTimeOptions}
                                        onSelect={(data) => { setHourEnd(data) }}
                                    />
                                </View>
                                <View style={{ width: '50%' }}>
                                    <SelectPicker
                                        label="Minutes"
                                        required={true}
                                        selectedValue={minuteEnd}
                                        options={appointmentMinutesOption}
                                        onSelect={(data) => setMinuteEnd(data)}
                                    />
                                </View>
                            </View>
                            <SelectPicker
                                label="Venue"
                                required={true}
                                selectedValue={updateModalData?.venue}
                                options={apptVenueOption}
                                onSelect={(data, index) => {
                                    setUpdateModalData((prevState) => ({ ...prevState, venue: data }));
                                    if (apptVenueOption[index - 1].children.length > 0) {
                                        setAppointmentChildVenue([]);
                                        apptVenueOption[index - 1].children.map((value) => {
                                            setAppointmentChildVenue((oldValue) => [
                                                ...oldValue,
                                                { label: value.name, value: value.name, key: value.name }
                                            ]);
                                        });
                                    }
                                    if (data != "Studio" || updateModalData?.venue != "Studio") {
                                        setUpdateModalData((prevState) => ({ ...prevState, venue_two: '' }))
                                    }
                                }}
                            />
                            {
                                (updateModalData?.venue == "Studio") &&
                                (
                                    <SelectPicker
                                        required={false}
                                        selectedValue={updateModalData?.venue_two}
                                        options={appointmentChildVenue}
                                        onSelect={(data) => setUpdateModalData((prevState) => ({ ...prevState, venue_two: data }))}
                                    />
                                )
                            }
                            <TextField
                                placeholder="Pax"
                                required={false}
                                editable={true}
                                keyboardType='numeric'
                                label="Pax"
                                onChange={(data) =>
                                    setUpdateModalData((prevState) => ({ ...prevState, pax: data }))
                                }
                                value={updateModalData?.pax}
                            />
                            <TextField
                                placeholder="Client Name"
                                required={false}
                                editable={true}
                                label="Client Name"
                                value={updateModalData?.client_name}
                                onChange={(data) =>
                                    setUpdateModalData((prevState) => ({ ...prevState, client_name: data }))
                                }
                            />
                            <TextField
                                placeholder="Sales Name"
                                required={false}
                                editable={true}
                                label="Sales Name"
                                onChange={(data) =>
                                    setUpdateModalData((prevState) => ({ ...prevState, sales_name: data }))
                                }
                                value={updateModalData?.sales_name}
                            />
                            <TextField
                                placeholder="Lead ID"
                                required={false}
                                editable={false}
                                label="Lead ID"
                                value={updateModalData?.lead?.runner_no}
                            />
                            {/* <View style={{ flexDirection: 'row', marginVertical: 5, alignItems: "center" }}>
                                    <CheckBox />
                                    <Text>Add appointment to calendar?</Text>
                                </View> */}
                            <DefaultButton
                                onPress={updateAppointment}
                                textButton="SAVE DETAILS"
                            />
                        </ScrollView>
                    </Overlay>
                    <View style={{ marginTop: 5, flex: 1 }}>
                        <ScrollView
                            nestedScrollEnabled={true}
                        >
                            {dashboard.appointments &&
                                Object.entries(dashboard.appointments).map((item) => {
                                    return (

                                        <AppointmentItem
                                            key={item[1].id}
                                            onViewPress={() => {
                                                setShowUpdateModal(!showUpdateModal);
                                                setUpdateModalData(item[1]);
                                                setHour(item[1].time.split(":")[0]);
                                                setMinute(item[1].time.split(":")[1]);
                                                setHourEnd(item[1].time_end?.split(":")[0]);
                                                setMinuteEnd(item[1].time_end?.split(":")[1]);

                                                // COMPARING DATA
                                                setHourCompare(item[1].time.split(":")[0]);
                                                setMinuteCompare(item[1].time.split(":")[1]);
                                                setHourCompareEnd(item[1].time_end?.split(":")[0]);
                                                setMinuteCompareEnd(item[1].time_end?.split(":")[1]);
                                                setVenueCompare(item[1].venue);
                                                setVenueTwoCompare(item[1].venue_two);
                                                setDateCompare(moment(item[1].date, 'DD-MM-YYYY').format('YYYY-MM-DD'));
                                            }
                                            }
                                            item={item[1]}
                                        />
                                    )
                                })

                            }
                        </ScrollView>
                    </View>

                </View>
            </View>

        </View>
    );
};

export default HomeScreen2;

