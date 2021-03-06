import React, { useState } from "react";
import {
    Text,
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity
}
    from "react-native";
import { Card, Badge } from 'react-native-elements';
import moment from 'moment';
const InspectionRadioGroup = props => {

    return (
        <View key={props.key} style={{flexDirection:'row', height:40, justifyContent:'space-between'}}>
            <TouchableOpacity onPress={() => props.onViewPress("YES")}>
                <View style={[styles.wrapper,{backgroundColor: (props.value == "YES" ? "grey":"white")}]}>
                    <Text>YES</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => props.onViewPress("NO")}>
                <View style={[styles.wrapper,{backgroundColor: (props.value == "NO" ? "grey":"white")}]}>
                    <Text>NO</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => props.onViewPress("NAN")}>
                <View style={[styles.wrapper,{backgroundColor: (props.value == "NAN" ? "grey":"white")}]}>
                    <Text>NA</Text>
                </View>
            </TouchableOpacity>
        </View>

    );
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: 'white',
        height: 40,
        padding: 10,
        flexDirection: 'row',
        justifyContent:'center',
        margin: 1,
        width:100,
        borderRadius:8
    },
    col_1: {
        alignItems: 'flex-start',
        width: '60%'
    },
    col_2: {
        alignItems: 'flex-end',
        width: '40%',
        paddingRight: 10
    }
});

export default InspectionRadioGroup;
