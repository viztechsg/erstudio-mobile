import React, { useState } from "react";
import {
    Text,
    View,
    StyleSheet,
    Picker
}
    from "react-native";

const SelectPicker = props => {
    const [selectedValue, setSelectedValue] = useState(props.selectedValue ? props.selectedValue : '');
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
            <View style={{ backgroundColor: '#fff', height: 40, elevation: 1 }}>
                <Picker
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
                </Picker>
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

export default SelectPicker;
