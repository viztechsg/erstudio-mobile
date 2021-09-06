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
const WorkSchedule = props => {

    return (

        <TouchableOpacity onPress={() => props.onViewPress()}>
            <View style={styles.wrapper}>
                <View style={{ width: '10%', alignItems: 'center', justifyContent: 'center' }}>
                    <Badge value={props.no} badgeStyle={{ backgroundColor: 'grey' }} />
                </View>
                <View style={{ paddingVertical: 0 }}>
                    {/* DATE AND TIME */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 5 }}>
                        <View style={{ width: '50%' }}>
                            <Text style={{ color: 'black', fontSize: 18, overflow: 'hidden' }}>{props.item.scope_of_work}</Text>
                            <Text style={{ color: 'black', fontSize: 15 }}>{props.item.vendor?.name}</Text>
                        </View>
                        <View style={{ width: '50%', justifyContent:'center', paddingLeft:30 }}>
                            <Text style={{ color: 'black', fontSize: 10 }}>From: {moment(props.item.start_date).format('DD/MM/YYYY')}</Text>
                            <Text style={{ color: 'black', fontSize: 10 }}>To: {moment(props.item.end_date).format('DD/MM/YYYY')}</Text>
                        </View>
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

export default WorkSchedule;
