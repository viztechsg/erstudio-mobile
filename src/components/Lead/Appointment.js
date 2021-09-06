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
const Appointment = props => {

    return (

        <TouchableOpacity onPress={() => props.onViewPress()} key={'APPT_'+props.no}>
            <View style={styles.wrapper}>
                <View style={{ width: '10%', alignItems: 'center', justifyContent:'center' }}>
                    <Badge value={props.no} badgeStyle={{ backgroundColor: 'grey' }} />
                </View>
                <View style={{paddingVertical:0}}>
                    {/* DATE AND TIME */}
                    <View style={{ flexDirection: 'row', justifyContent:'space-around', alignItems:'flex-start', marginBottom:5 }}>
                        <View style={{ width: '50%' }}>
                            <Text>{moment(props.item.date).format('ddd, DD MMM YYYY')}</Text>
                        </View>
                        <View style={{ width: '50%' }}>
                            <Text style={{ color: 'black' }}>{props.item.time}</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={{ color: 'black', fontSize:18 }}>{props.item.venue}</Text>
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

export default Appointment;
