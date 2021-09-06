import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Button, SafeAreaView, Alert } from 'react-native';
import TextField from '../../../components/TextField';
import SelectPicker from '../../../components/SelectPicker';
import LongText from '../../../components/LongText';
import DefaultButton from '../../../components/DefaultButton';
import ImageField from '../../../components/ImageField';
//REDUX
import { createLead } from '../../../actions/leadAction';
import { useDispatch } from 'react-redux';

const ProgressCreateScreen = ({ props, navigation }) => {
    const [leadID, setLeadID] = useState("");
    const [clientName, setClientName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");

    const onClientNameChange = name => {
        setClientName(name);
    }

    const onPhoneNumberChange = phone => {
        setPhoneNumber(phone);
    }

    const onEmailChange = email => {
        setEmail(email);
    }

    const dispatch = useDispatch();

    const onSubmitCreation = () => {
        Alert.alert('Success','Progress added')
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
                <Text style={{ fontSize: 20 }}>Add Project Progress</Text>
                <Text style={{ fontSize: 14, color: 'red' }}>*Required fields</Text>
            </View>
            <View style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <SelectPicker label="Area" required={true} />
                    <SelectPicker label="Sow" required={true} />
                    <ImageField label="Progress Photo" required={true} />
                    <SelectPicker label="Photo taken on" required={false} />
                    <LongText label="Remarks" required={false} />
                </ScrollView>
                <SafeAreaView>
                    <DefaultButton onPress={() => onSubmitCreation} textButton="UPDATE PROGRESS" />
                </SafeAreaView>
            </View>
        </View>
    )
}

export default ProgressCreateScreen;