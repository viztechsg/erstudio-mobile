import React, { useState } from "react";
import { 
        Text, 
        View, 
        TextInput, 
        StyleSheet,
        TouchableOpacity
        }
        from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';
const ImageField = (props) => {
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
            <TouchableOpacity>
                <View style={{height:150, borderColor:'grey', borderRadius:8, borderWidth:2, alignItems:'center', justifyContent:'center'}}>
                    <Icon name="pluscircleo" size={60} color="grey" />
                </View>
            </TouchableOpacity>
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

export default ImageField;
