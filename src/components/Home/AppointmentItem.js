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
const AppointmentItem = props => {

    return (

        <TouchableOpacity onPress={() => props.onViewPress()}>
            <View style={styles.wrapper}>
                <View style={styles.row}>
                    <View style={styles.column_2}>
                        <Text style={styles.textDate}>{moment(props.item.date).format('ddd, DD MM YYYY')}</Text>
                    </View>
                </View>
                <View style={[styles.row, { flexDirection: "row" }]}>
                    <View style={styles.column_2}>
                        <Text style={styles.text}>{props.item.venue}</Text>
                    </View>
                    <View style={{ width: '50%', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                        <Text style={styles.text}>{props.item.time}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: 'white', 
        padding: 10, 
        paddingTop: 0, 
        paddingBottom: 20, 
        borderRadius: 5, 
        marginVertical: 2
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

export default AppointmentItem;
