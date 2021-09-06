import React, { useState } from "react";
import {
    Text,
    View,
    StyleSheet,
    Picker,
    TouchableOpacity
}
    from "react-native";
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
const DatePicker = props => {
    const [selectedDate, setSelectedDate] = useState( props.selectedDate ? props.selectedDate : new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setSelectedDate(currentDate);
        props.onChange(currentDate);
    };
    return (
        <View style={{ marginTop: 20, }}>
            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                {props.label &&
                    <Text>{props.label}</Text>
                }

                {props.required &&
                    <Text style={{ color: 'red' }}>*</Text>
                }
            </View>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} key="DATE_BUTTON">
                <View style={{ backgroundColor: '#fff', height: 40, elevation: 1, justifyContent:'center', paddingLeft:10 }}>
                    <Text>{moment(selectedDate).format('DD-MM-YYYY')}</Text>
                </View>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    testID="dateTimePicker12"
                    value={selectedDate}
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    inputSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        height: 50,
        marginBottom: 10
    },
    searchIcon: {
        padding: 10,
    },
    input: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 0,
        backgroundColor: '#fff',
        color: '#424242',
    },
});

export default DatePicker;