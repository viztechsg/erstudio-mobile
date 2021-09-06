import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, Button, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
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
import * as data from '../../dummy/data/leadsData';
import Appointment from '../../components/Lead/Appointment';
import { singleLead, addLeadAppointment, addLeadRemark, setLeadStatus } from '../../services/lead';
import AppointmentModal from '../../components/Lead/AppointmentModal';
import DatePicker from '../../components/DatePicker';
import { appointmentTimeOptions } from '../../constants/Appointment';
import { getPropertyType, getSourceLead } from '../../services/lead';

// REDUX
import { updateLEad, getLeadData } from '../../actions/leadAction';
import { useDispatch, connect } from 'react-redux';
import { store } from '../../store/store';
import { allUsers, getConditionTypes } from '../../services/config';

const LeadEditScreen = ({ props, navigation }) => {

    const dispatch = useDispatch();

    const { item } = navigation.state.params;
    const [itemData, setItemData] = useState(item.appointment);
    const [remarkData, setRemarkData] = useState(item.remarks);
    const [dataRemark, setDataRemark] = useState([]);
    const [statusData, setStatusData] = useState("");
    const [data, setData] = useState({});
    const [appointmentModal, setAppointmentModal] = useState(false);
    const [remarkModal, setRemarkModal] = useState(false);
    const remarkCheckboxes = [
        { id: 1, value: 'No answer' },
        { id: 2, value: 'Message not replied' },
        { id: 3, value: 'Wrong Number' },
        { id: 4, value: "Customer request to call back" },
    ]

    

    const [remarkCheck, setRemarkCheck] = useState("");

    const [appointmentDate, setAppointmentDate] = useState(new Date(1598051730000));
    const [appointmentTime, setAppointmentTime] = useState(appointmentTimeOptions[0].id);
    const [appointmentVenue, setAppointmentVenue] = useState("Office");

    const [sourceLeadOption, setSourceLeadOption] = useState([]);
    const [propertyTypeOption, setPropertyTypeOption] = useState([]);
    const [conditionTypeOption, setConditionTypeOption] = useState([]);
    const [salesmanOption, setSalesmanOption] = useState([]);

    useEffect(() => {
        singleLead(item.id).then((data) => {
            setData(data)
            setDataRemark([]);
            rebuildRemarkObject(data.remarks)
        });
    }, [item.id, itemData, remarkData, statusData, onSubmitUpdate])



    useEffect(() => {
        getPropertyType().then(data => {
            setPropertyTypeOption(data);
            setData(prevState => ({ ...prevState, property_type_id: data.property_type_id }));
        });
        getSourceLead().then(data => {
            setSourceLeadOption(data);
            setData(prevState => ({ ...prevState, source_id: data.source_id }));
        });
        allUsers().then((data) => {
            setSalesmanOption(data.data.data);
            setData(prevState => ({ ...prevState, sales_id: data.data.data.sales_id }));
        });
        getConditionTypes().then(data => {
            setConditionTypeOption(data.data);
            setData(prevState => ({ ...prevState, condition_type_id: data.data.condition_type_id }));
        });
    }, [])

    const rebuildRemarkObject = (data) => {
        data.map((value) => {
            setDataRemark((oldValue) => [...oldValue, { time: moment(value.created_at).format("DD/MM/YYYY"), title: value.remarks }]);
        })
    }

    const statusOption = [
        {
            id: "newlead",
            name: "New Lead"
        },
        {
            id: "follow_up",
            name: "Follow Up"
        },
        {
            id: "failed",
            name: "Failed"
        },
        {
            id: "successful",
            name: "Successful"
        },
        {
            id: "void",
            name: "Void"
        },
        {
            id: "reassign",
            name: "Reassign"
        },
        {
            id: "lost",
            name: "Lost"
        },
    ];


    const onSelectedDate = (child) => {
        setAppointmentDate(child);
    }

    const onSelectTime = (child) => {
        setAppointmentTime(child);
    }

    const onSelectStatus = (child) => {
        setData(prevState => ({ ...prevState, status: child }));
    }

    const appointmentModalToggle = () => {
        setAppointmentModal(!appointmentModal);
    };

    const remarkModalToggle = () => {
        setRemarkModal(!remarkModal);
    };

    const onSelectPropertyType = (child) => {
        setData(prevState => ({ ...prevState, property_type_id: child }));
    }

    const onSelectSourceLead = (child) => {
        setData(prevState => ({ ...prevState, source_id: child }));
    }

    const addAppointment = () => {
        let appointmentItem = {
            lead_id: item.id,
            company_id: 1,
            name: 'Appointment',
            date: appointmentDate,
            venue: appointmentVenue,
            time: appointmentTime
        }
        setItemData([...itemData, appointmentItem]);
        addLeadAppointment(appointmentItem)
            .then(appointmentModalToggle())
            .then(
                () => {
                    setAppointmentVenue("Office");
                    setAppointmentDate(new Date(1598051730000));
                    setAppointmentTime(appointmentTimeOptions[0]);
                }
            );

        console.log(itemData);
    }

    const addRemark = () => {
        let remarkItem = {
            lead_id: item.id,
            remarks: remarkCheck
        }
        setRemarkData([...remarkData, remarkItem]);
        addLeadRemark(remarkItem)
            .then(remarkModalToggle())
            .then(
                () => {
                    setRemarkCheck("");
                }
            );
    }


    const onSubmitUpdate = () => {
        dispatch(
            updateLEad(
                {
                    clientName: data.client_name,
                    email: data.email,
                    phoneNumber: data.contact_number,
                    propertyType: data.property_type_id ? data.property_type_id : item.property_type_id,
                    status: data.status ? data.status : item.status,
                    sourceLead: data.source_id ? data.source_id  : item.source_id,
                    postalCode: data.postal_code,
                    roadName: data.road_name,
                    roadNo: data.road_no,
                    residence: data.residence,
                    blockNo: data.block_no,
                    salesId: data.sales_id ? data.sales_id : item.sales_id , 
                    budget: data.budget, 
                    conditionType: data.condition_type_id ? data.condition_type_id : item.condition_type_id
                },
                item.id
            ));

        dispatch(getLeadData());
    }


    const stateLeadStatus = (type) => {
        setLeadStatus(type, item.id).then(() => setStatusData([...statusData, type]));
        dispatch(getLeadData());
    }

    if (!data) return false;
    return (
        <View style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'stretch',
            // padding: 20,
            backgroundColor: '#F3F3F3',
        }}>

            {/* APPOINTMENT MODAL  */}
            <Overlay isVisible={appointmentModal} onBackdropPress={appointmentModalToggle} overlayStyle={{ width: '80%' }}>
                <View>
                    <Text style={[styles.title, { color: 'grey', fontWeight: '800', fontSize: 18 }]}>Appointment Details</Text>
                    <DatePicker required={true} label="Date" onChange={onSelectedDate} />
                    <SelectPicker label="Time" required={true} selectedValue={appointmentTime} options={appointmentTimeOptions} onSelect={onSelectTime} />
                    <TextField placeholder="Venue" required={true} editable={true} label="Venue" onChange={venue => setAppointmentVenue(venue)} value={appointmentVenue} />
                    <TextField placeholder="Client Name" required={false} editable={false} label="Client Name" value={data.client_name} />
                    <TextField placeholder="Sales Name" required={false} editable={false} label="Sales Name" value={data.direct_salesman ? data.direct_salesman.name : item.direct_salesman.name} />
                    <TextField placeholder="Lead ID" required={false} editable={false} label="Lead ID" value={data.runner_no} />
                    <DefaultButton onPress={addAppointment} textButton="SAVE DETAILS" />
                </View>
            </Overlay>

            {/* REMARK MODAL */}
            <Overlay isVisible={remarkModal} onBackdropPress={remarkModalToggle} overlayStyle={{ width: '80%' }}>
                <View>
                    <Text style={[styles.title, { color: 'grey', fontWeight: '800', fontSize: 18 }]}>Please choose a reason</Text>
                    {
                        remarkCheckboxes.map((item, index) => {
                            return (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <RadioButton
                                        value={item.value}
                                        status={(remarkCheck == item.value) ? 'checked' : 'unchecked'}
                                        onPress={() => setRemarkCheck(item.value)}
                                    />
                                    <Text style={{ fontSize: 14 }}>{item.value}</Text>
                                </View>
                            )
                        })
                    }
                    <LongText onChange={(remark) => setRemarkCheck(remark)} />
                    <DefaultButton onPress={addRemark} textButton="SAVE CHANGES" />
                </View>
            </Overlay>
            {/* FORM */}
            <View style={{ padding: 20, paddingBottom: 0 }}>
                <Text style={{ fontSize: 20 }}>Edit Lead</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Fields */}
                <View style={{ padding: 20 }}>
                    <TextField placeholder="Lead ID" required={false} editable={false} label="Lead ID" value={data.runner_no} />
                    <TextField placeholder="Client Name" required={false} label="Client Name" value={data.client_name} onChange={(data) => setData(prevState => ({ ...prevState, client_name: data }))} />
                    <TextField placeholder="Valid Singapore number" keyboardType='phone-pad' required={false} label="Contact Number" value={data.contact_number} onChange={(data) => setData(prevState => ({ ...prevState, contact_number: data }))} />
                    <SelectPicker label="Source" required={false} selectedValue={data.source_id ? data.source_id : item.source_id} options={sourceLeadOption} onSelect={onSelectSourceLead} />
                    <SelectPicker label="Assign To" required={true} selectedValue={data.sales_id ? data.sales_id : item.sales_id} onSelect={(data) => {setData(prevState => ({ ...prevState, sales_id: data })); console.log(data)}} options={salesmanOption} />
                    <TextField
                        placeholder="Amount"
                        required={false}
                        label="Budget"
                        keyboardType='numeric'
                        value={data.budget}
                        onChange={(data) => setData(prevState => ({ ...prevState, budget: data }))}
                    />
                    <TextField placeholder="Email" required={false} label="Email" value={data.email} onChange={(data) => setData(prevState => ({ ...prevState, email: data }))} />
                    <TextField placeholder="Leads created on" label="Leads created on" required={false} editable={false} value={moment(data.created_at).format("YYYY/MM/DD")} />

                    <Text style={{ marginTop: 20 }}>Address</Text>
                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: -15 }}>
                        <View style={{ width: '49%' }}>
                            <TextField placeholder="Block/House No." required={false} onChange={(data) => setData(prevState => ({ ...prevState, block_no: data }))} value={data.block_no} />
                        </View>
                        <View style={{ width: '49%' }}>
                            <TextField placeholder="Estate Name" required={false} onChange={(data) => setData(prevState => ({ ...prevState, residence: data }))} value={data.residence} />
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                        <View style={{ width: '49%' }}>
                            <TextField placeholder="Street/Road Name" required={false} onChange={(data) => setData(prevState => ({ ...prevState, road_name: data }))} value={data.road_name} />
                        </View>
                        <View style={{ width: '49%' }}>
                            <TextField placeholder="Postal Code" required={false} keyboardType='numeric' onChange={(data) => setData(prevState => ({ ...prevState, postal_code: data }))} value={data.postal_code} />
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                        <View style={{ width: '49%' }}>
                            <TextField placeholder="Unit Number" required={false} onChange={(data) => setData(prevState => ({ ...prevState, road_no: data }))} value={data.road_no} />
                        </View>
                    </View>

                    <SelectPicker label="Property Type" required={false} selectedValue={data.property_type_id ? data.property_type_id : item.property_type_id} options={propertyTypeOption} onSelect={onSelectPropertyType} />

                    <SelectPicker label="Condition Type" required={true} options={conditionTypeOption} onSelect={(data) => setData(prevState => ({ ...prevState, condition_type_id: data }))} selectedValue={data.condition_type_id ? data.condition_type_id : item.condition_type_id} />

                    <SelectPicker label="Lead Status" required={false} required={true} selectedValue={data.status ? data.status : item.status} options={statusOption} onSelect={onSelectStatus} />

                </View>

                {/* Appointment */}
                <View style={{ padding: 20, marginTop: -15 }}>
                    <Text>Appointment</Text>
                </View>
                {

                    (data.appointment && data.appointment.length < 1) &&
                    (<View style={{ backgroundColor: '#B9B9B9', alignItems: 'center', justifyContent: 'center', height: 30, marginTop: -10 }}>
                        <Text style={{ color: '#808080' }}>No appointments made</Text>
                    </View>)
                }
                <View style={{ flexDirection: 'column' }}>
                    {
                        data.appointment && data.appointment.map((item, index) => {
                            return (<Appointment item={item} no={index + 1} onViewPress={() => console.log(index + 1)} />)
                        })
                    }
                </View>
                <TouchableOpacity onPress={appointmentModalToggle}>
                    <View style={{ backgroundColor: 'white', justifyContent: 'center', height: 45, marginTop: 5, paddingHorizontal: 20, flexDirection: 'row' }}>

                        <View style={{ width: '50%', justifyContent: 'center' }}>
                            <Text style={{ color: 'black' }}>Add new appointment</Text>
                        </View>
                        <View style={{ width: '50%', alignItems: 'flex-end', justifyContent: 'center' }}>
                            <Icon name="plus" size={30} color="black" />
                        </View>

                    </View>
                </TouchableOpacity>

                {/* Remark */}
                <View style={{
                    backgroundColor: 'white', padding: 30, margin: -20, marginTop: 15, marginBottom: 1
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: '50%' }}>
                            <Text style={{ marginTop: -20, marginLeft: 10 }}>Remark</Text>
                        </View>
                    </View>

                    <Timeline
                        style={styles.list}
                        data={dataRemark}
                        circleSize={10}
                        circleColor='grey'
                        lineColor='grey'
                        timeContainerStyle={{ minWidth: 93 }}
                        timeStyle={{ textAlign: 'center', color: 'grey', marginTop: -5, marginBottom: 10 }}
                        titleStyle={{ textAlign: 'left', color: 'grey', marginTop: -15, fontWeight: '100', fontSize: 14, marginBottom: 10 }}
                        innerCircle={'dot'}
                    />
                </View>
                <TouchableOpacity onPress={remarkModalToggle}>
                    <View style={{ backgroundColor: 'white', justifyContent: 'center', height: 45, marginTop: 5, paddingHorizontal: 20, flexDirection: 'row' }}>
                        <View style={{ width: '50%', justifyContent: 'center' }}>
                            <Text style={{ color: 'black' }}>Add new remark</Text>
                        </View>
                        <View style={{ width: '50%', alignItems: 'flex-end', justifyContent: 'center' }}>
                            <Icon name="plus" size={30} color="black" />
                        </View>
                    </View>
                </TouchableOpacity>
                {/* Buttons */}
                <DefaultButton onPress={() => onSubmitUpdate()} textButton="SAVE CHANGES" />
                {
                    (data.status != "successful") && <DefaultButton onPress={() => { stateLeadStatus("success") }} textButton="SUCCESS LEAD" disabled={false} />
                }

                {
                    (data.status != "returned" && data.status != "successful" && data.status != "lost") && <DefaultButton onPress={() => { stateLeadStatus("return") }} textButton="RETURN LEAD" />
                }

            </ScrollView>
        </View>
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