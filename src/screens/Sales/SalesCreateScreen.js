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
import { getPropertyType } from '../../services/lead';
import { createSalesProject, getSalesData } from '../../actions/salesAction';

const SalesCreateScreen = ({ props, navigation }) => {
    const [leadID, setLeadID] = useState("");
    const [clientName, setClientName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [propertyType, setPropertyType] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [roadName, setRoadName] = useState("");
    const [roadNo, setRoadNo] = useState("");
    const [residence, setResidence] = useState("");
    const [blockNo, setBlockNo] = useState("");
    const [projectStart, setProjectStart] = useState(new Date());

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
    }

    const onSelectPropertyType = (data) => {
        setPropertyType(data);
    }

    const rebuildSourceLeadData = (data) => {
        data.map((value) => {
            setSourceLead((oldValue) => [...oldValue, { id: value.id, name: value.runner_no }]);
        })
        setLeadID(data[0].id);
    }

    const dispatch = useDispatch();

    const onSubmitCreation =  () => {
        // const { leadID, clientName, email, phoneNumber, propertyType, postalCode, roadName, roadNo, residence, projectStart, blockNo, budget } = params;
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
        dispatch(getSalesData());
        setClientName("");
        setPhoneNumber("");
        setEmail("");
    }

    useEffect(() => {
        dispatch(getLeadData());
    }, [])

    useEffect(() => {
        getPropertyType().then(data => {
            setPropertyTypeOption(data);
            setPropertyType(data[0].id);
        });
    }, [])

    store.subscribe(() => {
        setSourceLead([]);
        rebuildSourceLeadData(store.getState().leadsReducer.data);
    });

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
                    <SelectPicker  key={2} label="Assign To" required={true} />

                    <TextField 
                        placeholder="Client Name" 
                        required={true} 
                        label="Client Name" 
                        value={clientName} 
                        onChange={ name => onClientNameChange(name)} 
                    />

                    <TextField 
                        placeholder="Valid Singapore number" 
                        required={true} 
                        label="Contact Number" 
                        value={phoneNumber} 
                        onChange={ phone => onPhoneNumberChange(phone)}
                    />

                    <TextField 
                        placeholder="Email" 
                        required={false} 
                        label="Email" 
                        value={email} 
                        onChange={ email => onEmailChange(email)}
                    />

                    <Text style={{marginTop:20}}>Address</Text>
                    <View style={{flexDirection:'row', width:'100%', justifyContent:'space-between', marginTop:-15}}>
                        <View style={{width:'49%'}}>
                            <TextField placeholder="Road No." required={false} value={roadNo} onChange={ roadNo => setRoadNo(roadNo)}/>
                        </View>
                        <View style={{width:'49%'}}>
                            <TextField placeholder="Residence" required={false} value={residence} onChange={ residence => setResidence(residence)}  />
                        </View>
                    </View>

                    <View style={{flexDirection:'row', width:'100%', justifyContent:'space-between'}}>
                        <View style={{width:'49%'}}>
                            <TextField placeholder="Road Name" required={false} value={roadName} onChange={ roadName => setRoadName(roadName)}/>
                        </View>
                        <View style={{width:'49%'}}>
                            <TextField placeholder="Postal Code" required={false} value={postalCode} onChange={ postalCode => setPostalCode(postalCode)}  />
                        </View>
                    </View>
                    
                    <View style={{flexDirection:'row', width:'100%', justifyContent:'space-between'}}>
                        <View style={{width:'49%'}}>
                            <TextField placeholder="Unit No." required={false} value={blockNo} onChange={ blockNo => setBlockNo(blockNo)} />
                        </View>
                    </View>
                    

                    {
                        propertyTypeOption && <SelectPicker key={3} label="Property Type" required={true} selectedValue={propertyType} options={propertyTypeOption} onSelect={onSelectPropertyType} />
                    }

                    <DatePicker required={false} label="Project Start Date" onChange={ startDate => setProjectStart(startDate) } />

                    <DefaultButton onPress={onSubmitCreation} textButton="CREATE PROJECT" />

                </ScrollView>
            </View>
        </View>
    )
}

export default SalesCreateScreen;