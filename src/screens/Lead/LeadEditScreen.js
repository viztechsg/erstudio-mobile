import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Alert,
    CheckBox,
    Dimensions,
    KeyboardAvoidingView
} from 'react-native';
import { Card, Badge, Overlay } from 'react-native-elements';
import TextField from '../../components/TextField';
import SelectPicker from '../../components/SelectPicker';
import LongText from '../../components/LongText';
import DefaultButton from '../../components/DefaultButton';
import Timeline from 'react-native-timeline-flatlist';
import Icon from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import { RadioButton } from 'react-native-paper';
//import styles from './styles';
import Appointment from '../../components/Lead/Appointment';
import {
    singleLead,
    addLeadAppointment,
    addLeadRemark,
    setLeadStatus,
} from '../../services/lead';
import DatePicker from '../../components/DatePicker';
import { appointmentTimeOptions, appointmentMinutesOption, appointmentSecondVenue } from '../../constants/Appointment';
import { getPropertyType, getSourceLead, updateLeadAppointment } from '../../services/lead';

// REDUX
import { updateLEad, getLeadData } from '../../actions/leadAction';
import { useDispatch, connect } from 'react-redux';
import {
    allUsers,
    getConditionTypes,
    getCountryCodeSource,
    getRemarkSource,
    getVenueSource,
} from '../../services/config';
import * as Calendar from 'expo-calendar';
import { store } from '../../store/store';
import { Platform } from 'react-native';
import { leadNormalSource, leadRefSource, salutations } from '../../constants/Lead';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const LeadEditScreen = ({ props, navigation }) => {

    const dispatch = useDispatch();

    const { item } = navigation.state.params;
    const [itemData, setItemData] = useState(item.appointment);
    const [remarkData, setRemarkData] = useState(item.remarks);
    const [dataRemark, setDataRemark] = useState([]);
    const [statusData, setStatusData] = useState('');
    const [data, setData] = useState([]);
    const [appointmentModal, setAppointmentModal] = useState(false);
    const [remarkModal, setRemarkModal] = useState(false);
    const [remarkCheckboxes, setRemarkCheckboxes] = useState([]);
    const [remarkId, setRemarkId] = useState(0);
    const [isNormal, setIsNormal] = useState(false);
    const [countryCodes, setCountryCodes] = useState([]);

    const [remarkCheck, setRemarkCheck] = useState('');
    const [normalSource, setNormalSource] = useState('');
    const [normalSourceTwo, setNormalSourceTwo] = useState(data?.normal_option_source);
    const [normalNotes, setNormalNotes] = useState('');
    const [appointmentDate, setAppointmentDate] = useState(new Date());
    const [appointmentTime, setAppointmentTime] = useState(
        appointmentTimeOptions[0].value
    );
    const [appointmentMinutes, setAppointmentMinutes] = useState(appointmentMinutesOption[0].value)
    const [appointmentVenue, setAppointmentVenue] = useState('Office');
    const [appointmentVenueTwo, setAppointmentVenueTwo] = useState("");
    const [apptPax, setApptPax] = useState('');
    const [apptClientName, setApptClientName] = useState(null);
    const [apptSalesName, setApptSalesName] = useState(null);
    const [isCalendar, setIsCalendar] = useState(false);
    const [apptVenueOption, setApptVenueOption] = useState([]);

    const [sourceLeadOption, setSourceLeadOption] = useState([]);
    const [propertyTypeOption, setPropertyTypeOption] = useState([]);
    const [conditionTypeOption, setConditionTypeOption] = useState([]);
    const [salesmanOption, setSalesmanOption] = useState([]);

    const [cancelReasonToggle, setCancelReasonToggle] = useState(false);
    const [CRValue, setCRValue] = useState('');
    const [calendar, setCalendar] = useState([]);

    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updateModalData, setUpdateModalData] = useState([]);
    const [hour, setHour] = useState("08");
    const [minute, setMinute] = useState("00");
    const [appointmentDataLog, setAppointmentDataLog] = useState([]);

    const [oldEmail, setOldEmail] = useState("");
    const [oldBudget, setOldBudget] = useState("");
    const [oldBlockNo, setOldBlockNo] = useState("");
    const [oldEstateName, setOldEstateName] = useState("");
    const [oldStreetName, setOldStreetName] = useState("");
    const [oldPostal, setOldPostal] = useState("");
    const [oldUnitNo, setOldUnitNo] = useState("");

    useEffect(() => {
        getRemarkSource().then((data) => rebuildRemarkOption(data.data));
        const isNormalLength = filterByValue(leadRefSource, data?.normal_option_source ? data?.normal_option_source : item.normal_option_source);
        if (isNormalLength > 0) {
            setIsNormal(true);
        }
    }, [item.id]);

    const rebuildRemarkOption = (data) => {
        setRemarkCheckboxes([]);
        data.map((value) => {
            setRemarkCheckboxes((oldValue) => [
                ...oldValue,
                { id: value.id, value: value.name },
            ]);
        });
    };

    const filterByValue = (array, string) => {
        const object = array.filter(o =>
            Object.keys(o).some(k => o[k].includes(string)));

        return object.length
    }

    useEffect(() => {
        singleLead(item.id).then((data) => {
            setData(data);
            setDataRemark([]);
            rebuildRemarkObject(data.remarks);
        });
    }, [item.id, itemData, remarkData, statusData, onSubmitUpdate, addAppointment, appointmentDataLog]);

    useEffect(() => {
        getPropertyType().then((data) => {
            setPropertyTypeOption([]);
            data.map((value) => {
                setPropertyTypeOption((oldValue) => [
                    ...oldValue,
                    { label: value.name, value: value.id, key: value.name },
                ]);
            });
        });
        getSourceLead().then((data) => {
            setSourceLeadOption([]);
            data.map((value) => {
                setSourceLeadOption((oldValue) => [
                    ...oldValue,
                    { label: value.name, value: value.id, key: value.name },
                ]);
            });
        });
        getVenueSource().then((data) => {
            setApptVenueOption([]);
            data.data.map((value) => {
                setApptVenueOption((oldValue) => [
                    ...oldValue,
                    { label: value.name, value: value.name, key: value.name }
                ]);
            });
        });
        allUsers().then((data) => {
            setSalesmanOption([]);
            data.data.data.map((value) => {
                setSalesmanOption((oldValue) => [
                    ...oldValue,
                    { label: value.name, value: value.id, key: value.name },
                ]);
            });
        });
        getConditionTypes().then((data) => {
            setConditionTypeOption([]);
            data.data.map((value) => {
                setConditionTypeOption((oldValue) => [
                    ...oldValue,
                    { label: value.name, value: value.id, key: value.name },
                ]);
            });
        });
        getCountryCodeSource().then((data) => {
            setCountryCodes([]);
            data.data.map((value) => {
                setCountryCodes((oldValue) => [
                    ...oldValue,
                    { label: value.code + " - " + value.name, value: value.code, key: value.code }
                ]);
            });
        });
    }, [item.id]);

    const rebuildRemarkObject = (data) => {
        data.map((value) => {
            setDataRemark((oldValue) => [
                ...oldValue,
                {
                    time: moment(value.created_at).format('DD/MM/YYYY'),
                    title: value.remarks,
                },
            ]);
        });
    };

    const counterArray = [
        'Call in',
        'Walk In',
        'Referral'
    ]

    const counterArrayTwo = [
        'Personal',
        'Agent',
        'Other',
        'Client'
    ]

    const statusOption = [
        {
            value: 'newlead',
            label: 'New Lead',
            key: 'New Lead',
        },
        {
            value: 'followup',
            label: 'Follow Up',
            key: 'Follow Up',
        },
        {
            value: 'return',
            label: 'Failed',
            key: 'Failed',
        },
        {
            value: 'successful',
            label: 'Successful',
            key: 'Successful',
        },
        {
            value: 'failed',
            label: 'Return',
            key: 'Return',
        },
        {
            value: 'reassign',
            label: 'Reassign',
            key: 'Reassign',
        },
        {
            value: 'lost',
            label: 'Lost',
            key: 'Lost',
        },
    ];

    const cancelReason = [
        {
            value: 'No Answer',
            id: 'No Answer',
        },
        {
            value: 'Messages no reply',
            id: 'Messages no reply',
        },
        {
            value: 'Wrong number',
            id: 'Wrong number',
        },
        {
            value: 'Customer request call back',
            id: 'Customer request call back',
        },
        {
            value: 'Etc.',
            id: 'Etc.',
        },
    ];

    const onSelectedDate = (child) => {
        setAppointmentDate(child);
    };

    const onSelectTime = (child) => {
        setAppointmentTime(child);
    };

    const onSelectMinute = (child) => {
        setAppointmentMinutes(child);
    };

    const onSelectStatus = (child) => {
        setData((prevState) => ({ ...prevState, status: child }));
    };

    const appointmentModalToggle = () => {
        setAppointmentModal(!appointmentModal);
    };

    const remarkModalToggle = () => {
        setRemarkModal(!remarkModal);
    };

    const CRToggle = () => {
        setCancelReasonToggle(!cancelReasonToggle);
        setCRValue('');
    };

    const onSelectPropertyType = (child) => {
        setData((prevState) => ({ ...prevState, property_type_id: child }));
    };

    const onSelectSourceLead = (child) => {
        setData((prevState) => ({ ...prevState, source_id: child }));
    };

    useEffect(() => {
        (async () => {
            const { status } = await Calendar.requestCalendarPermissionsAsync();
            if (status === 'granted') {
                const calendars = await Calendar.getCalendarsAsync();
                setCalendar(calendars[0]);
            }
        })();
    }, []);

    // CALENDAR EVENT
    const addEvent = async () => {
        const { status } = await Calendar.requestCalendarPermissionsAsync();
        if (status === 'granted') {
            Calendar.createEventAsync(calendar.id, {
                title: `Appt with ${apptClientName ? apptClientName : item.client_name}`,
                startDate: new Date(
                    moment(
                        moment(appointmentDate).format('YYYY-MM-DD') + ' ' + appointmentTime
                    )
                ).toISOString(),
                endDate: new Date(
                    moment(
                        moment(appointmentDate).format('YYYY-MM-DD') + ' ' + appointmentTime
                    ).add(1, 'hour')
                ).toISOString(),
                location: appointmentVenue,
                timeZone: 'GMT+8',
                notes: `Meeting lead ${item.runner_no}`
            })
                .then((data) => console.log(`EVENT CREATED ${data}`))
                .catch((e) => console.log(e));
        }
    };

    const addAppointment = () => {
        if (isCalendar) {
            addEvent().then((data) => console.log("Event added"));
        }

        if (Platform.OS == "ios") {
            addEvent().then((data) => console.log("Event added"));
        }

        let appointmentItem = {
            lead_id: item.id,
            company_id: 1,
            name: 'Appointment',
            date: moment(appointmentDate).format('YYYY-MM-DD'),
            venue: appointmentVenue,
            time: hour + ":" + minute,
            client_name: apptClientName ? apptClientName : item.client_name,
            sales_name: apptSalesName ? apptSalesName : item.direct_salesman?.name,
            pax: apptPax,
            venue_two: appointmentVenueTwo
        };
        setItemData([...itemData, appointmentItem]);
        addLeadAppointment(appointmentItem)
            .then(appointmentModalToggle())
            .then(() => {
                setAppointmentVenue('Office');
                setAppointmentDate(new Date());
                setApptSalesName(null);
                setApptClientName(null);
                setAppointmentTime(appointmentTimeOptions[0].value);
                setHour("08");
                setMinute("00");
                setApptPax("");
                setAppointmentVenueTwo("");
            });
    };

    const updateAppointment = () => {
        let appointmentItem = {
            appointmentId: updateModalData?.id,
            name: 'Appointment',
            date: moment(updateModalData?.date).format('YYYY-MM-DD'),
            venue: updateModalData?.venue,
            time: hour + ":" + minute,
            client_name: updateModalData?.client_name,
            sales_name: updateModalData?.sales_name,
            pax: updateModalData?.pax,
            venue_two: updateModalData?.venue_two
        };
        setAppointmentDataLog([...appointmentDataLog, appointmentItem]);
        updateLeadAppointment(appointmentItem)
            .then(setShowUpdateModal(!showUpdateModal))
            .then(setUpdateModalData([]));
    };

    const addRemark = () => {
        let remarkItem = {
            lead_id: item.id,
            remarks: remarkCheck,
            remark_id: remarkId,
        };
        setRemarkData([...remarkData, remarkItem]);
        addLeadRemark(remarkItem)
            .then(remarkModalToggle())
            .then(() => {
                setRemarkCheck('');
            });
    };

    const returnLead = () => {
        if (CRValue == '' || CRValue == null) {
            Alert.alert('Reason', 'Please choose or type a reason');
            return;
        }

        stateLeadStatus('failed');
    };

    const validateRequiredInput = () => {
        let msg = '';
        let failCounter = 0;
        if (data?.client_name == '' || data?.client_name == null) {
            msg += 'Please fill client name \n';
            failCounter++;
        }
        if (data?.contact_number == '' || data?.contact_number == null) {
            msg += 'Please fill phone number \n';
            failCounter++;
        }
        if (data?.source_id == '' || data?.source_id == null) {
            msg += 'Please choose source of lead \n';
            failCounter++;
        }
        if (data?.sales_id == '' || data?.sales_id == null) {
            msg += 'Please choose sales/designer \n';
            failCounter++;
        }
        if (data?.property_type_id == '' || data?.property_type_id == null) {
            msg += 'Please choose property type \n';
            failCounter++;
        }
        if (data?.condition_type_id == '' || data?.condition_type_id == null) {
            msg += 'Please choose condition type \n';
            failCounter++;
        }

        if (failCounter == 0) {
            //PASSED
            return { passed: true, msg }
        }

        return { passed: false, msg }
    }

    const onSubmitUpdate = () => {
        const { passed, msg } = validateRequiredInput();
        if (!passed) {
            Alert.alert('Invalid Input', msg);
            return;
        }
        dispatch(
            updateLEad(
                {
                    clientName: data.client_name,
                    email: data.email ? data.email : oldEmail,
                    phoneNumber: data.contact_number,
                    propertyType: data.property_type_id
                        ? data.property_type_id
                        : item.property_type_id,
                    status: data.status ? data.status : item.status,
                    sourceLead: data.source_id ? data.source_id : item.source_id,
                    postalCode: data.postal_code ? data.postal_code : oldPostal,
                    roadName: data.road_name ? data.road_name : oldStreetName,
                    roadNo: data.road_no ? data.road_no : oldUnitNo,
                    residence: data.residence ? data.residence : oldEstateName,
                    blockNo: data.block_no ? data.block_no : oldBlockNo,
                    salesId: data.sales_id ? data.sales_id : item.sales_id,
                    budget: data.budget ? data.budget : oldBudget,
                    conditionType: data.condition_type_id
                        ? data.condition_type_id
                        : item.condition_type_id,
                    moveInDate: data.move_in_date,
                    normal_option_source: normalSourceTwo ? normalSourceTwo : data.normal_option_source ? data.normal_option_source : item.normal_option_source,
                    normal_option_ref_notes: '',
                    memo: data.comments ? data.comments : item.comments,
                    salutation: data.client_title ? data.client_title : item.client_title,
                    country_code: data.country_code ? data.country_code : item.country_code
                },
                item.id
            )
        );

        wait(1000).then(() => navigation.navigate('List', { filterStatus: '', needAttention: '' }));
    };

    const stateLeadStatus = (type) => {
        setLeadStatus(type, item.id, CRValue).then(() =>
            setStatusData([...statusData, type])
        );
        wait(1000).then(() => navigation.navigate('List', { filterStatus: '', needAttention: '' }));
    };

    const onVoidPress = (id) => {
        Alert.alert(
            'Are you sure want to void this lead?',
            'The lead will be voided permanently. You will not be able to edit it again',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('CANCELED'),
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => {
                        console.log('VOIDED');
                    },
                },
            ],
            { cancelable: true }
        );
    };

    if (!data) return false;
    return (
        <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 20} style={{flex:1, paddingBottom:50}}>
            <View style={{
                // flex: 1,
                flexDirection: 'column',
                alignItems: 'stretch',
                // padding: 20,
                backgroundColor: '#F3F3F3',
                paddingBottom: 50
            }}>
                {/* APPOINTMENT UPDATE MODAL */}
                <Overlay
                    isVisible={showUpdateModal}
                    onBackdropPress={() => setShowUpdateModal(!showUpdateModal)}
                    overlayStyle={{ width: '80%', height: 500, paddingBottom: 40 }}
                >
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
                            selectedDate={new Date(updateModalData?.date)}
                            onChange={(data) =>
                                setUpdateModalData((prevState) => ({ ...prevState, date: data }))
                            }
                        />
                        <View style={{ flexDirection: 'row', marginTop: -10 }}>
                            <View style={{ width: '50%' }}>
                                <SelectPicker
                                    label="Hour"
                                    required={true}
                                    selectedValue={hour}
                                    options={appointmentTimeOptions}
                                    onSelect={(data) => setHour(data)}
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
                        {/* <TextField
                        placeholder="Venue"
                        required={true}
                        editable={true}
                        label="Venue"
                        onChange={(data) =>
                            setUpdateModalData((prevState) => ({ ...prevState, venue: data }))
                        }
                        value={updateModalData?.venue}
                    /> */}
                        <SelectPicker
                            label="Venue"
                            required={true}
                            selectedValue={updateModalData?.venue}
                            options={apptVenueOption}
                            onSelect={(data) => {
                                setUpdateModalData((prevState) => ({ ...prevState, venue: data }))
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
                                    options={appointmentSecondVenue}
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
                            value={item.runner_no}
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
                {/* APPOINTMENT MODAL  */}
                <Overlay
                    isVisible={appointmentModal}
                    onBackdropPress={appointmentModalToggle}
                    overlayStyle={{ width: '80%', height: 500, paddingBottom: 40 }}>
                    <Text
                        style={[
                            styles.title,
                            { color: 'grey', fontWeight: '800', fontSize: 18 },
                        ]}>
                        Appointment Details
                    </Text>
                    <ScrollView>
                        <DatePicker
                            required={true}
                            label="Date"
                            onChange={onSelectedDate}
                            selectedDate={appointmentDate}
                        />
                        <View style={{ flexDirection: 'row', marginTop: -10 }}>
                            <View style={{ width: '50%' }}>
                                <SelectPicker
                                    label="Hour"
                                    required={true}
                                    selectedValue={appointmentTime}
                                    options={appointmentTimeOptions}
                                    onSelect={onSelectTime}
                                />
                            </View>
                            <View style={{ width: '50%' }}>
                                <SelectPicker
                                    label="Minutes"
                                    required={true}
                                    selectedValue={appointmentMinutes}
                                    options={appointmentMinutesOption}
                                    onSelect={onSelectMinute}
                                />
                            </View>
                        </View>
                        {/* <TextField
                        placeholder="Venue"
                        required={true}
                        editable={true}
                        label="Venue"
                        onChange={(venue) => setAppointmentVenue(venue)}
                        value={appointmentVenue}
                    /> */}
                        <SelectPicker
                            label="Venue"
                            required={true}
                            selectedValue={appointmentVenue}
                            options={apptVenueOption}
                            onSelect={(data) => {
                                setAppointmentVenue(data);
                                if (data != "Studio") {
                                    setAppointmentVenueTwo("");
                                }
                            }}
                        />

                        {
                            (appointmentVenue == "Studio") &&
                            (
                                <SelectPicker
                                    required={false}
                                    selectedValue={appointmentVenueTwo}
                                    options={appointmentSecondVenue}
                                    onSelect={(data) => setAppointmentVenueTwo(data)}
                                />
                            )
                        }


                        <TextField
                            placeholder="Pax"
                            required={false}
                            editable={true}
                            label="Pax"
                            onChange={(pax) => setApptPax(pax)}
                            value={apptPax}
                        />
                        <TextField
                            placeholder="Client Name"
                            required={false}
                            editable={true}
                            label="Client Name"
                            value={apptClientName ? apptClientName : data.client_name}
                            onChange={(data) => setApptClientName(data)}
                        />
                        <TextField
                            placeholder="Sales Name"
                            required={false}
                            editable={true}
                            label="Sales Name"
                            onChange={(data) => setApptSalesName(data)}
                            value={
                                apptSalesName
                                    ? apptSalesName
                                    : item.direct_salesman?.name
                            }
                        />
                        <TextField
                            placeholder="Lead ID"
                            required={false}
                            editable={false}
                            label="Lead ID"
                            value={data.runner_no}
                        />
                        <View style={{ flexDirection: 'row', marginVertical: 5, alignItems: "center" }}>
                            <CheckBox value={isCalendar} onValueChange={setIsCalendar} />
                            <Text>Add appointment to calendar?</Text>
                        </View>
                        <DefaultButton
                            onPress={addAppointment}
                            textButton="SAVE DETAILS"
                        />
                    </ScrollView>

                </Overlay>

                {/* REMARK MODAL */}
                <Overlay
                    isVisible={remarkModal}
                    onBackdropPress={remarkModalToggle}
                    overlayStyle={{ width: '80%', height: Dimensions.height, marginBottom: Platform.OS == 'ios' ? 250 : 0 }}
                >
                    <View>
                        <Text
                            style={[
                                styles.title,
                                { color: 'grey', fontWeight: '800', fontSize: 18 },
                            ]}>
                            Please choose remark
                        </Text>
                        {remarkCheckboxes &&
                            remarkCheckboxes?.length > 0 &&
                            remarkCheckboxes.map((item, index) => {
                                return (
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <RadioButton.Android
                                            value={item.value}
                                            status={remarkCheck == item.value ? 'checked' : 'unchecked'}
                                            onPress={() => {
                                                setRemarkCheck(item.value);
                                                setRemarkId(item.id);
                                            }}
                                        />
                                        <Text style={{ fontSize: 14 }}>{item.value}</Text>
                                    </View>
                                );
                            })}
                        <LongText
                            value={remarkCheck}
                            onChange={(remark) => {
                                setRemarkCheck(remark);
                                setRemarkId(0);
                            }}
                        />
                        <DefaultButton onPress={addRemark} textButton="SAVE CHANGES" />
                    </View>
                </Overlay>

                {/* REMARK CANCEL REASON */}
                <Overlay
                    key="CR"
                    isVisible={cancelReasonToggle}
                    onBackdropPress={CRToggle}
                    overlayStyle={{ width: '80%', height: Dimensions.height, marginBottom: Platform.OS == 'ios' ? 250 : 0 }}
                >
                    <View>
                        <Text
                            style={[
                                styles.title,
                                { color: 'grey', fontWeight: '800', fontSize: 18 },
                            ]}>
                            Cancel reason
                        </Text>
                        {cancelReason.map((item, index) => {
                            return (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <RadioButton.Android
                                        value={item.value}
                                        status={CRValue == item.value ? 'checked' : 'unchecked'}
                                        onPress={() => setCRValue(item.value)}
                                    />
                                    <Text style={{ fontSize: 14 }}>{item.value}</Text>
                                </View>
                            );
                        })}
                        <LongText value={CRValue} onChange={(remark) => setCRValue(remark)} />
                        <DefaultButton onPress={returnLead} textButton="SAVE CHANGES" />
                    </View>
                </Overlay>

                {/* FORM */}
                <View style={{ padding: 20, paddingBottom: 0 }}>
                    <Text style={{ fontSize: 20 }}>Edit Lead</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Fields */}
                    <View style={{ padding: 20, paddingTop:0 }}>
                        <TextField
                            placeholder="Lead ID"
                            required={false}
                            editable={false}
                            label="Lead ID"
                            value={data.runner_no}
                        />
                        <View
                            style={{
                                flexDirection: 'row',
                                width: '100%',
                                justifyContent: 'space-between',
                            }}>
                            <View style={{ width: '30%' }}>
                                <SelectPicker
                                    label="Salutation"
                                    required={true}
                                    selectedValue={data.client_title ? data.client_title : item.client_title}
                                    options={salutations}
                                    onSelect={(salutation) => setData((prevState) => ({ ...prevState, client_title: salutation }))}
                                />
                            </View>
                            <View style={{ width: '69%' }}>
                                <TextField
                                    placeholder="Client Name"
                                    required={true}
                                    label="Client Name"
                                    value={data.client_name}
                                    onChange={(data) =>
                                        setData((prevState) => ({ ...prevState, client_name: data }))
                                    }
                                />
                            </View>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                width: '100%',
                                justifyContent: 'space-between',
                            }}>
                            <View style={{ width: '30%' }}>
                                <SelectPicker
                                    label="Code"
                                    required={true}
                                    selectedValue={data.country_code ? data.country_code : item.country_code}
                                    options={countryCodes}
                                    onSelect={(data) => setData((prevState) => ({ ...prevState, country_code: data }))}
                                />
                            </View>
                            <View style={{ width: '69%' }}>
                                <TextField
                                    placeholder="Valid Singapore number"
                                    keyboardType="phone-pad"
                                    required={true}
                                    label="Contact Number"
                                    value={data.contact_number}
                                    onChange={(data) =>
                                        setData((prevState) => ({ ...prevState, contact_number: data }))
                                    }
                                />
                            </View>
                        </View>



                        {
                            (store.getState().loginReducer.scopes.includes('lead-use-primary-source') && data?.user_id != data?.sales_id) &&
                            (
                                <SelectPicker
                                    key='BACD_ASD1'
                                    label="Source"
                                    required={true}
                                    selectedValue={data.source_id ? data.source_id : item.source_id}
                                    options={sourceLeadOption}
                                    onSelect={onSelectSourceLead}
                                />
                            )
                        }

                        {
                            (!store.getState().loginReducer.scopes.includes('lead-use-primary-source') && data?.user_id != data?.sales_id) &&
                            (
                                <SelectPicker
                                    key='BACD_ASD13'
                                    label="Source"
                                    required={true}
                                    selectedValue={data.source_id ? data.source_id : item.source_id}
                                    options={sourceLeadOption}
                                    onSelect={onSelectSourceLead}
                                    disabled={true}
                                />
                            )
                        }

                        {
                            (!store.getState().loginReducer.scopes.includes('lead-use-primary-source') && data?.user_id == data?.sales_id) &&
                            (
                                <SelectPicker
                                    key='BACD_ASD'
                                    label="Source"
                                    required={true}
                                    selectedValue={counterArray.includes(data?.normal_option_source ? data?.normal_option_source : item.normal_option_source) ? data?.normal_option_source ? data.normal_option_source : item.normal_option_source : 'Referral'}
                                    options={leadNormalSource}
                                    onSelect={(data) => {
                                        setData((prevState) => ({ ...prevState, normal_option_source: data }))
                                        if (data != "Referral") {
                                            setNormalSourceTwo("");
                                        }
                                    }}
                                />
                            )
                        }


                        {
                            (store.getState().loginReducer.scopes.includes('lead-use-primary-source') && data?.user_id == data?.sales_id) &&
                            (
                                <SelectPicker
                                    key='BACD_ASD'
                                    label="Source"
                                    required={true}
                                    selectedValue={counterArray.includes(data?.normal_option_source ? data?.normal_option_source : item.normal_option_source) ? data?.normal_option_source ? data.normal_option_source : item.normal_option_source : 'Referral'}
                                    options={leadNormalSource}
                                    onSelect={(data) => {
                                        setData((prevState) => ({ ...prevState, normal_option_source: data }))
                                        if (data != "Referral") {
                                            setNormalSourceTwo("");
                                        }
                                    }}
                                />
                            )
                        }


                        {
                            (!store.getState().loginReducer.scopes.includes('lead-use-primary-source') && data?.user_id == data?.sales_id) && (data?.normal_option_source == "Referral" || counterArrayTwo.includes(data?.normal_option_source))
                            &&
                            (
                                <SelectPicker
                                    key='BACD_ASASD'
                                    selectedValue={normalSourceTwo ? normalSourceTwo : item.normal_option_source}
                                    options={leadRefSource}
                                    onSelect={(data) => {
                                        setNormalSourceTwo(data);
                                    }}
                                />
                            )
                        }

                        {
                            (store.getState().loginReducer.scopes.includes('lead-use-primary-source') && data?.user_id == data?.sales_id) && (data?.normal_option_source == "Referral" || counterArrayTwo.includes(data?.normal_option_source))
                            &&
                            (
                                <SelectPicker
                                    key='BACD_ASASD'
                                    selectedValue={normalSourceTwo ? normalSourceTwo : item.normal_option_source}
                                    options={leadRefSource}
                                    onSelect={(data) => {
                                        setNormalSourceTwo(data);
                                    }}
                                />
                            )
                        }

                        {
                            store.getState().loginReducer.scopes.includes('lead-assign') &&
                            (
                                <SelectPicker
                                    label="Assign To"
                                    required={true}
                                    selectedValue={
                                        data.sales_id ? parseInt(data.sales_id) : parseInt(item.sales_id)
                                    }
                                    onSelect={(data) => {
                                        setData((prevState) => ({ ...prevState, sales_id: data }));
                                        console.log(data);
                                    }}
                                    options={salesmanOption}
                                />
                            )
                        }

                        <SelectPicker
                            label="Property Type"
                            required={true}
                            selectedValue={
                                data.property_type_id
                                    ? parseInt(data.property_type_id)
                                    : parseInt(item.property_type_id)
                            }
                            options={propertyTypeOption}
                            onSelect={onSelectPropertyType}
                        />

                        <SelectPicker
                            label="Condition Type"
                            required={true}
                            options={conditionTypeOption}
                            onSelect={(data) =>
                                setData((prevState) => ({ ...prevState, condition_type_id: data }))
                            }
                            selectedValue={
                                data.condition_type_id
                                    ? parseInt(data.condition_type_id)
                                    : parseInt(item.condition_type_id)
                            }
                        />

                        {
                            store.getState().loginReducer.scopes.includes('lead-update-status') &&
                            (
                                <SelectPicker
                                    label="Lead Status"
                                    required={true}
                                    required={true}
                                    selectedValue={data.status ? data.status : item.status}
                                    options={statusOption}
                                    onSelect={onSelectStatus}
                                />
                            )
                        }


                        <TextField
                            placeholder="Amount"
                            required={false}
                            label="Budget"
                            keyboardType='numeric'
                            value={data.budget ? data.budget : oldBudget}
                            onChange={(data) => {
                                setData(prevState => ({ ...prevState, budget: data }));
                                setOldBudget(data);
                            }
                            }
                        />
                        <TextField
                            placeholder="Email"
                            required={false}
                            label="Email"
                            value={data.email ? data.email : oldEmail}
                            onChange={(data) => {
                                setData((prevState) => ({ ...prevState, email: data }));
                                setOldEmail(data)
                            }

                            }
                        />
                        <TextField
                            placeholder="Leads created on"
                            label="Leads created on"
                            required={false}
                            editable={false}
                            value={moment(data.created_at).format('YYYY/MM/DD')}
                        />

                        <Text style={{ marginTop: 20 }}>Address</Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                width: '100%',
                                justifyContent: 'space-between',
                                marginTop: -15,
                            }}>
                            <View style={{ width: '49%' }}>
                                <TextField
                                    placeholder="Block/House No."
                                    required={false}
                                    onChange={(data) => {
                                        setData((prevState) => ({ ...prevState, block_no: data }));
                                        setOldBlockNo(data)
                                    }

                                    }
                                    value={data.block_no ? data.block_no : oldBlockNo}
                                />
                            </View>
                            <View style={{ width: '49%' }}>
                                <TextField
                                    placeholder="Estate Name"
                                    required={false}
                                    onChange={(data) => {
                                        setData((prevState) => ({ ...prevState, residence: data }));
                                        setOldEstateName(data);
                                    }

                                    }
                                    value={data.residence ? data.residence : oldEstateName}
                                />
                            </View>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                width: '100%',
                                justifyContent: 'space-between',
                            }}>
                            <View style={{ width: '49%' }}>
                                <TextField
                                    placeholder="Street/Road Name"
                                    required={false}
                                    onChange={(data) => {
                                        setData((prevState) => ({ ...prevState, road_name: data }))
                                        setOldStreetName(data)
                                    }

                                    }
                                    value={data.road_name ? data.road_name : oldStreetName}
                                />
                            </View>
                            <View style={{ width: '49%' }}>
                                <TextField
                                    placeholder="Postal Code"
                                    required={false}
                                    keyboardType="numeric"
                                    onChange={(data) => {
                                        setData((prevState) => ({ ...prevState, postal_code: data }));
                                        setOldPostal(data)
                                    }

                                    }
                                    value={data.postal_code ? data.postal_code : oldPostal}
                                />
                            </View>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                width: '100%',
                                justifyContent: 'space-between',
                            }}>
                            <View style={{ width: '49%' }}>
                                <TextField
                                    placeholder="Unit Number"
                                    required={false}
                                    onChange={(data) => {
                                        setData((prevState) => ({ ...prevState, road_no: data }))
                                        setOldUnitNo(data)
                                    }

                                    }
                                    value={data.road_no ? data.road_no : oldUnitNo}
                                />
                            </View>
                        </View>

                        <DatePicker
                            label='Est. Move in date'
                            selectedDate={new Date(data.move_in_date ? data.move_in_date : item.move_in_date)}
                            onChange={(value) =>
                                setData((prevState) => ({ ...prevState, move_in_date: value }))
                            }
                        />

                        <LongText
                            label='Memo'
                            value={data.comments ? data.comments : item.comments}
                            onChange={(value) =>
                                setData((prevState) => ({ ...prevState, comments: value }))
                            }
                        />
                    </View>

                    {/* Appointment */}
                    <View style={{ padding: 20, marginTop: -15 }}>
                        <Text>Appointment</Text>
                    </View>
                    {data.appointment && data.appointment.length < 1 && (
                        <View
                            style={{
                                backgroundColor: '#B9B9B9',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: 30,
                                marginTop: -10,
                            }}>
                            <Text style={{ color: '#808080' }}>No appointments made</Text>
                        </View>
                    )}
                    <View style={{ flexDirection: 'column' }}>
                        {data.appointment &&
                            data.appointment.map((item, index) => {
                                return (
                                    <Appointment
                                        item={item}
                                        no={index + 1}
                                        onViewPress={() => {
                                            setShowUpdateModal(!showUpdateModal);
                                            setUpdateModalData(item);
                                            setHour(item.time.split(":")[0]);
                                            setMinute(item.time.split(":")[1]);
                                        }
                                        }
                                    />
                                );
                            })}
                    </View>
                    <TouchableOpacity onPress={appointmentModalToggle}>
                        <View
                            style={{
                                backgroundColor: 'white',
                                justifyContent: 'center',
                                height: 45,
                                marginTop: 5,
                                paddingHorizontal: 20,
                                flexDirection: 'row',
                            }}>
                            <View style={{ width: '50%', justifyContent: 'center' }}>
                                <Text style={{ color: 'black' }}>Add new appointment</Text>
                            </View>
                            <View
                                style={{
                                    width: '50%',
                                    alignItems: 'flex-end',
                                    justifyContent: 'center',
                                }}>
                                <Icon name="plus" size={30} color="black" />
                            </View>
                        </View>
                    </TouchableOpacity>
                    {/* Remark */}
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: '50%' }}>
                            <Text style={{ marginLeft: 20, marginTop: 20 }}>Remarks</Text>
                        </View>
                    </View>

                    {
                        dataRemark.length > 0 ?
                            (
                                <View
                                    style={{
                                        backgroundColor: 'white',
                                        paddingHorizontal: 50,
                                        margin: -20,
                                        marginTop: 15,
                                        marginBottom: 1,
                                        paddingBottom: 5,
                                        paddingTop: 10,
                                    }}>
                                    <Timeline
                                        style={styles.list}
                                        data={dataRemark}
                                        circleSize={10}
                                        circleColor="grey"
                                        lineColor="grey"
                                        timeContainerStyle={{ minWidth: 93 }}
                                        listViewContainerStyle={{ paddingTop: 10 }}
                                        timeStyle={{
                                            textAlign: 'center',
                                            color: 'grey',
                                            marginTop: -5,
                                            marginBottom: 10,
                                        }}
                                        titleStyle={{
                                            textAlign: 'left',
                                            color: 'grey',
                                            marginTop: -15,
                                            fontWeight: '100',
                                            fontSize: 14,
                                            marginBottom: 10,
                                        }}
                                        innerCircle={'dot'}
                                    />

                                </View>
                            ) :
                            (
                                <View
                                    style={{
                                        backgroundColor: '#B9B9B9',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: 30,
                                    }}>
                                    <Text style={{ color: '#808080' }}>No remark yet</Text>
                                </View>
                            )
                    }

                    <TouchableOpacity onPress={remarkModalToggle}>
                        <View
                            style={{
                                backgroundColor: 'white',
                                justifyContent: 'center',
                                height: 45,
                                marginTop: 5,
                                paddingHorizontal: 20,
                                flexDirection: 'row',
                            }}>
                            <View style={{ width: '50%', justifyContent: 'center' }}>
                                <Text style={{ color: 'black' }}>Add new remark</Text>
                            </View>
                            <View
                                style={{
                                    width: '50%',
                                    alignItems: 'flex-end',
                                    justifyContent: 'center',
                                }}>
                                <Icon name="plus" size={30} color="black" />
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Buttons */}
                    <DefaultButton
                        onPress={() => onSubmitUpdate()}
                        textButton="SAVE CHANGES"
                    />

                    {(store.getState().loginReducer.scopes.includes('lead-update-status') && data.status != 'successful') && (
                        <DefaultButton
                            onPress={() => {
                                stateLeadStatus('success');
                            }}
                            textButton="SUCCESS LEAD"
                            disabled={false}
                        />
                    )}

                    {store.getState().loginReducer.scopes.includes('lead-update-status') && data.status != 'return' &&
                        data.status != 'successful' &&
                        data.status != 'lost' && (
                            <DefaultButton
                                onPress={() => {
                                    CRToggle();
                                }}
                                textButton="RETURN LEAD"
                            />
                        )}

                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 65,
        backgroundColor: 'white'
    },
    list: {
        flex: 1,
        marginTop: 20,
        marginLeft: 20
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    descriptionContainer: {
        flexDirection: 'row',
        paddingRight: 50
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    textDescription: {
        marginLeft: 10,
        color: 'gray'
    },
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 65,
        backgroundColor: 'white'
    },
    list: {
        flex: 1,
        marginTop: 20,
    },
    title: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'black'
    },
    descriptionContainer: {
        flexDirection: 'row',
        paddingRight: 50
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    textDescription: {
        marginLeft: 10,
        color: 'gray'
    }
});
export default connect(null, { getLeadData })(LeadEditScreen);