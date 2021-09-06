import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Button, TouchableOpacity, StyleSheet } from 'react-native';
import TextField from '../../components/TextField';
import SelectPicker from '../../components/SelectPicker';
import LongText from '../../components/LongText';
import DefaultButton from '../../components/DefaultButton';
import styles from './styles';
import Icon from 'react-native-vector-icons/AntDesign';
import { Card, Badge, Overlay } from 'react-native-elements';
import Timeline from 'react-native-timeline-flatlist';
import { RadioButton } from 'react-native-paper';
import moment from 'moment';
//REDUX
import { createLead, getLeadData } from '../../actions/leadAction';
import { useDispatch } from 'react-redux';
import { getPropertyType, getSourceLead } from '../../services/lead';
import { allUsers, getConditionTypes } from '../../services/config';
import { store } from '../../store/store';

const LeadCreateScreen = ({ props, navigation }) => {
    const [leadID, setLeadID] = useState("");
    const [clientName, setClientName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [propertyType, setPropertyType] = useState("");
    const [sourceLead, setSourceLead] = useState("");
    const [budget, setBudget] = useState(0);
    const [remarks, setRemarks] = useState([]);
    const [conditionType, setConditionType] = useState("");

    const [postalCode, setPostalCode] = useState("");
    const [roadName, setRoadName] = useState("");
    const [roadNo, setRoadNo] = useState("");
    const [residence, setResidence] = useState("");
    const [blockNo, setBlockNo] = useState("");

    const [status, setStatus] = useState("newlead");
    const [selectedAssign, setSelectedAssign] = useState(store.getState().loginReducer.id);

    const [sourceLeadOption, setSourceLeadOption] = useState([]);
    const [propertyTypeOption, setPropertyTypeOption] = useState([]);
    const [userSourceOption, setUserSourceOption] = useState([]);
    const [conditionTypeOption, setConditionTypeOption] = useState([]);

    // REMARK
    const [remarkCheck, setRemarkCheck] = useState("");
    const [remarkModal, setRemarkModal] = useState(false);
    const remarkCheckboxes = [
        { id: 1, value: 'No answer' },
        { id: 2, value: 'Message not replied' },
        { id: 3, value: 'Wrong Number' },
        { id: 4, value: "Customer request to call back" },
    ]

    const statusOption = [
        {
            id: "newlad",
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

    // const rebuildUserObject = (data) => {
    //     data.map((value) => {
    //         setUserSourceOption((oldValue) => [...oldValue, { id: value.id, name: value.name }]);
    //     })
    // }

    const onClientNameChange = name => {
        setClientName(name);
    }

    const onPhoneNumberChange = phone => {
        setPhoneNumber(phone);
    }

    const onEmailChange = email => {
        setEmail(email);
    }

    const onSelectPropertyType = (data) => {
        setPropertyType(data);
    }

    const onSelectSourceLead = (data) => {
        setSourceLead(data);
    }

    const onPostalCodeChange = (data) => {
        setPostalCode(data);
    }

    const onRoadNameChange = (data) => {
        setRoadName(data);
    }

    const onRoadNoChange = (data) => {
        setRoadNo(data);
    }

    const onSelectStatus = status => {
        setStatus(status);
    }

    const dispatch = useDispatch();

    const onSubmitCreation = () => {
        dispatch(
            createLead({
                clientName,
                email,
                phoneNumber,
                propertyType,
                status,
                sourceLead,
                postalCode,
                roadName,
                roadNo,
                residence,
                blockNo,
                selectedAssign,
                budget,
                remarks,
                conditionType
            }));

        setClientName("");
        setPhoneNumber("");
        setEmail("");
        setRemarkCheck("");
        dispatch(getLeadData());
    }

    useEffect(() => {
        getPropertyType().then(data => setPropertyTypeOption(data));
        getSourceLead().then(data => setSourceLeadOption(data));
        allUsers().then((data) => setUserSourceOption(data.data.data));
        getConditionTypes().then(data => setConditionTypeOption(data.data));
    }, [])

    const remarkModalToggle = () => {
        setRemarkModal(!remarkModal);
    };

    const addRemark = () => {
        let remarkItem = {
            time: moment(new Date()).format("DD/MM/YYYY"),
            title: remarkCheck,
            remark: remarkCheck
        }

        setRemarks([...remarks, remarkItem]);
        setRemarkModal(!remarkModal);
        setRemarkCheck("");
    }

    useEffect(() => {
        console.log(remarks)
    },[remarks])


    return (
        <View style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'stretch',
            backgroundColor: '#F3F3F3',
        }}>
            {/* REMARK MODAL */}
            <Overlay isVisible={remarkModal} onBackdropPress={remarkModalToggle} overlayStyle={{ width: '80%' }}>
                <View>
                    <Text style={[styles.title, { color: 'grey', fontWeight: '800', fontSize: 18 }]}>Choose Remark</Text>
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
            <View style={{ padding: 20, paddingBottom: 0 }}>
                <Text style={{ fontSize: 20 }}>Add New Lead</Text>
                <Text style={{ fontSize: 14, color: 'red' }}>*Required fields</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ flex: 1, padding: 20, paddingTop: 0 }}>

                    <TextField
                        placeholder="Client Name"
                        required={true}
                        label="Client Name"
                        value={clientName}
                        onChange={name => onClientNameChange(name)}
                    />

                    <TextField
                        placeholder="Valid Singapore number"
                        required={true}
                        label="Contact Number"
                        keyboardType='phone-pad'
                        value={phoneNumber}
                        onChange={phone => onPhoneNumberChange(phone)}
                    />

                    {
                        sourceLeadOption && <SelectPicker label="Source" required={true} selectedValue={sourceLead} options={sourceLeadOption} onSelect={onSelectSourceLead} />
                    }

                    <SelectPicker label="Assign To" required={true} selectedValue={selectedAssign} onSelect={(data) => setSelectedAssign(data)} options={userSourceOption} />

                    <TextField
                        placeholder="Amount"
                        required={false}
                        label="Budget"
                        keyboardType='numeric'
                        onChange={data => setBudget(data)}
                    />

                    <TextField
                        placeholder="Email"
                        required={false}
                        label="Email"
                        value={email}
                        onChange={email => onEmailChange(email)}
                    />

                    <Text style={{ marginTop: 20 }}>Address</Text>
                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: -15 }}>
                        <View style={{ width: '49%' }}>
                            <TextField placeholder="Block/House No." required={false} onChange={blockNo => setBlockNo(blockNo)} />
                        </View>
                        <View style={{ width: '49%' }}>
                            <TextField placeholder="Estate Name" required={false} onChange={residence => setResidence(residence)} />
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                        <View style={{ width: '49%' }}>
                            <TextField placeholder="Street/Road Name" required={false} onChange={roadName => onRoadNameChange(roadName)} />
                        </View>
                        <View style={{ width: '49%' }}>
                            <TextField placeholder="Postal Code" required={false} keyboardType='numeric' onChange={postalCode => onPostalCodeChange(postalCode)} />
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                        <View style={{ width: '49%' }}>
                            <TextField placeholder="Unit Number" required={false} onChange={roadNo => onRoadNoChange(roadNo)} />
                        </View>
                    </View>

                    {
                        propertyTypeOption && <SelectPicker label="Property Type" required={true} selectedValue={propertyType} options={propertyTypeOption} onSelect={onSelectPropertyType} />
                    }

                    <SelectPicker label="Condition Type" required={true} options={conditionTypeOption} onSelect={data => setConditionType(data)} selectedValue={conditionType} />

                    {/* <SelectPicker label="Lead Status" required={true} required={true} selectedValue={status} options={statusOption} onSelect={onSelectStatus} /> */}
                </View>
                <View>
                    {/* Remark */}
                    <View style={{
                        backgroundColor: 'white', paddingHorizontal: 50, margin: -20, marginTop: 15, marginBottom: 1, paddingBottom:5, paddingTop:10
                    }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: '50%' }}>
                                <Text style={{  marginLeft: -10 }}>Remark</Text>
                            </View>
                        </View>

                        <Timeline
                            style={style2.list}
                            data={remarks}
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

                    <DefaultButton onPress={onSubmitCreation} textButton="CREATE LEAD" />
                </View>
            </ScrollView>
        </View>
    )
}
const style2 = StyleSheet.create({
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
export default LeadCreateScreen;