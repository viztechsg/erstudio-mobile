import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Button } from 'react-native';
import TextField from '../../components/TextField';
import SelectPicker from '../../components/SelectPicker';
import LongText from '../../components/LongText';
import DefaultButton from '../../components/DefaultButton';
import DatePicker from '../../components/DatePicker';
import styles from './styles';

//REDUX
import { getLeadData } from '../../actions/leadAction';
import { useDispatch } from 'react-redux';
import { store } from '../../store/store';
import { getPropertyType, singleLead } from '../../services/lead';
import { createSalesProject, getSalesData } from '../../actions/salesAction';
import { allUsers } from '../../services/config';
import api from '../../api/api';

const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
};
const SalesCreateScreen = ({ props, navigation }) => {
    const [leadID, setLeadID] = useState("");
    const [clientName, setClientName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [propertyType, setPropertyType] = useState(null);
    const [postalCode, setPostalCode] = useState("");
    const [roadName, setRoadName] = useState("");
    const [roadNo, setRoadNo] = useState("");
    const [residence, setResidence] = useState("");
    const [blockNo, setBlockNo] = useState("");
    const [projectStart, setProjectStart] = useState(new Date());
    const [assignTo, setAssignTo] = useState([]);
    const [salesman, setSalesman] = useState("");
    const [sourceLead, setSourceLead] = useState([]);
    const [propertyTypeOption, setPropertyTypeOption] = useState([]);

    const onClientNameChange = name => {
        setClientName(name);
    }

    const onPhoneNumberChange = phone => {
        setPhoneNumber(phone);
    }

    const onEmailChange = email => {
        setEmail(email);
    }

    const onSelectSourceLead = (data) => {
        setLeadID(data);

        // FILL ANOTHER FIELD
        singleLead(data).then((data) => {

            setClientName(data.client_name);
            setEmail(data.email);
            setPhoneNumber(data.contact_number);
            setPropertyType(data.property_type_id);
            setRoadNo(data.road_no);
            setResidence(data.residence);
            setRoadName(data.road_name);
            setBlockNo(data.block_no);
            setPostalCode(data.postal_code);
        });
    }

    const onSelectPropertyType = (data) => {
        console.log(data);
        setPropertyType(data);
    }

    const rebuildSourceLeadData = (data) => {
        data.map((value) => {
            setSourceLead((oldValue) => [...oldValue, { value: value.id, label: value.runner_no, key: value.runner_no }]);
        })
        setLeadID(data[0].id);
    }

    const dispatch = useDispatch();

    const onSubmitCreation = () => {
        dispatch(
            createSalesProject({
                leadID,
                clientName,
                email,
                phoneNumber,
                propertyType,
                postalCode,
                roadName,
                roadNo,
                residence,
                projectStart,
                blockNo,
                budget: "900000"
            })
        );
        setClientName("");
        setPhoneNumber("");
        setEmail("");
        wait(1000).then(() => navigation.navigate('Sales'));
    }

    useEffect(() => {
        getAllLead();
    }, [])

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
        allUsers().then((data) => {
            setAssignTo([]);
            data.data.data.map((value) => {
                setAssignTo((oldValue) => [
                    ...oldValue,
                    { label: value.name, value: value.id, key: value.name },
                ]);
            });
        });
    }, [])

    const getAllLead = () => {
        api.get(`/leads`, {
            headers: {
                Authorization: `Bearer ${store.getState().loginReducer.token}`
            }
        })
            .then((data) => {
                console.log(data);
                setSourceLead([]);
                rebuildSourceLeadData(data.data.data.lead);
            })
            .catch((error) => {
                console.log(error.response);
            })
    }


    return (
        <View style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'stretch',
            padding: 20,
            backgroundColor: '#F3F3F3',
        }}>
            <View>
                <Text style={{ fontSize: 20 }}>Add New Project</Text>
                <Text style={{ fontSize: 14, color: 'red' }}>*Required fields</Text>
            </View>
            <View style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <SelectPicker key={1} label="Source" required={true} selectedValue={leadID} onSelect={onSelectSourceLead} options={sourceLead} />

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
                        value={phoneNumber}
                        onChange={phone => onPhoneNumberChange(phone)}
                    />
                    {
                        propertyTypeOption && <SelectPicker key={3} label="Property Type" required={true} selectedValue={parseInt(propertyType)} options={propertyTypeOption} onSelect={onSelectPropertyType} />
                    }
                    <View style={{flexDirection:'row',marginTop: 20 }}>
                    <Text>Address</Text>
                    <Text style={{ color: 'red' }}>*</Text>
                    </View>
                    
                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: -15 }}>
                        <View style={{ width: '49%' }}>
                            <TextField placeholder="Road No." required={false} value={roadNo} onChange={roadNo => setRoadNo(roadNo)} />
                        </View>
                        <View style={{ width: '49%' }}>
                            <TextField placeholder="Residence" required={false} value={residence} onChange={residence => setResidence(residence)} />
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                        <View style={{ width: '49%' }}>
                            <TextField placeholder="Road Name" required={false} value={roadName} onChange={roadName => setRoadName(roadName)} />
                        </View>
                        <View style={{ width: '49%' }}>
                            <TextField placeholder="Postal Code" required={false} value={postalCode} onChange={postalCode => setPostalCode(postalCode)} />
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                        <View style={{ width: '49%' }}>
                            <TextField placeholder="Unit No." required={false} value={blockNo} onChange={blockNo => setBlockNo(blockNo)} />
                        </View>
                    </View>

                    <TextField
                        placeholder="Email"
                        required={false}
                        label="Email"
                        value={email}
                        onChange={email => onEmailChange(email)}
                    />

                    <SelectPicker key={2} label="Assign To" required={false} selectedValue={salesman} onSelect={(data) => setSalesman(data)} options={assignTo} />
                    <DatePicker required={false} label="Project Start Date" onChange={startDate => setProjectStart(startDate)} />

                    <DefaultButton onPress={onSubmitCreation} textButton="CREATE PROJECT" />

                </ScrollView>
            </View>
        </View>
    )
}

export default SalesCreateScreen;