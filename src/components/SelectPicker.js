import moment from "moment";
import React, { useState } from "react";
import { useEffect } from "react";
import {
    Text,
    View,
    StyleSheet,
    Picker
}
    from "react-native";
import RNPickerSelect from 'react-native-picker-select';

const SelectPicker = props => {
    const [selectedValue, setSelectedValue] = useState(props.selectedValue);
    const options = [
        {
            label: "Text",
            value: "Text",
            key: 1
        }
    ]
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
            <View style={{
                backgroundColor: props.disabled ? 'gray': '#fff', height: 40, elevation: 1, borderWidth: 1,
                borderColor: 'gray',
                borderRadius: 4,
            }}>
                {/* <Picker
                    selectedValue={selectedValue}
                    mode="dropdown"
                    style={[styles.input, {
                        height: 40,

                    }]}
                    onValueChange={(itemValue, itemIndex) => { setSelectedValue(itemValue); props.onSelect(itemValue) }}
                >
                    {
                        props.options ? props.options.map((item, index) => {
                            return (<Picker.Item label={item.name} value={item.id} />)
                        }) : <Picker.Item label="Select" value="" />
                    }
                </Picker> */}
                <RNPickerSelect
                    style={pickerSelectStyles}
                    value={props.selectedValue}
                    onValueChange={(value, index) => { setSelectedValue(value); props.onSelect(value,index) }}
                    items={props.options ? props.options : options}
                    disabled={props.disabled ? props.disabled : false}
                />
            </View>
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

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        height:40,
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        height:40,
        paddingRight: 30, // to ensure the text is never behind the icon
        elevation: 3
    },
});

export default SelectPicker;
