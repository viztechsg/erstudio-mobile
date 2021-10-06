import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    CheckBox
} from 'react-native';
import {  Overlay } from 'react-native-elements';
import TextField from '../components/TextField';
import SelectPicker from '../components/SelectPicker';
import DefaultButton from '../components/DefaultButton';
const AppointmentUpdateModal = props => {
    const [showModal, setShowModal] = useState(props.showModal ? props.showModal : false);
    const [data, setData] = useState(props.item);
    useEffect(() => {
        console.log(props.item);
    }, [])
    return (

        <Overlay
            isVisible={props.showModal}
            onBackdropPress={props.onBackPress}
            overlayStyle={{ width: '80%' }}>
            <View>
                <Text
                    style={
                        { color: 'grey', fontWeight: '800', fontSize: 18 }
                    }>
                    Update Appointment Details
                    {JSON.stringify(props.item)}
                </Text>
                {/* <DatePicker
                    required={true}
                    label="Date"
                    onChange={onSelectedDate}
                    selectedDate={appointmentDate}
                />
                <SelectPicker
                    label="Time"
                    required={true}
                    selectedValue={appointmentTime}
                    options={appointmentTimeOptions}
                    onSelect={onSelectTime}
                />
                <TextField
                    placeholder="Venue"
                    required={true}
                    editable={true}
                    label="Venue"
                    // onChange={(venue) => setAppointmentVenue(venue)}
                    // value={appointmentVenue}
                /> */}
                <TextField
                    placeholder="Client Name"
                    required={false}
                    editable={true}
                    label="Client Name"
                    // value={data?.lead.client_name}
                    // onChange={(data) => setApptClientName(data)}
                />
                <TextField
                    placeholder="Sales Name"
                    required={false}
                    editable={true}
                    label="Sales Name"
                    // onChange={(data) => setApptSalesName(data)}
                    // value={
                    //     apptSalesName
                    //         ? apptSalesName
                    //         : item.direct_salesman?.name
                    // }
                />
                {/* <TextField
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
                /> */}
            </View>
        </Overlay>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: 'white',
        padding: 10,
        paddingVertical: 10,
        borderRadius: 5,
        marginVertical: 2,
        flexDirection: 'row'
    },
    column_2: {
        width: '50%'
    },
    textDate: {
        fontSize: 14,
        color: '#C6C6C6'
    },
    text: {
        fontSize: 16,
        color: '#707070'
    }
});

export default AppointmentUpdateModal;



