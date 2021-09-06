import React, { useState } from "react";
import { 
        Text, 
        View, 
        TextInput, 
        StyleSheet
        }
        from "react-native";

const TextField = ({value, onChange, ...props}) => {
    return (
        <View style={{marginTop:20}}>
            <View style={{flexDirection:'row', marginBottom:5}}>
            { props.label &&
                <Text>{props.label}</Text>
            }

            { props.required &&
                <Text style={{color:'red'}}>*</Text>
            }
            </View>
            <TextInput value={value} keyboardType={props.keyboardType ? props.keyboardType : 'default'} onChangeText={onChange} placeholder={props.placeholder} style={{backgroundColor: (props.editable == false) ? '#B9B9B9' : 'white', height:40, padding:5, width:props.width ? props.width : '100%', elevation:1 }} editable={props.editable ? props.editable : true} />
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

export default TextField;
