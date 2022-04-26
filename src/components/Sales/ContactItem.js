import React, { useState, memo } from "react";
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
const ContactItem = props => {

    return (

        <TouchableOpacity onPress={() => props.onViewPress()}>
            <View style={styles.wrapper}>
                <View style={{ paddingVertical: 0 }}>
                    {/* DATE AND TIME */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 5 }}>
                        <View style={{ width: '100%' }}>
                            <Text style={{ color: 'black', fontSize: 18, overflow: 'hidden' }}>{props.item.name}</Text>
                            <Text style={{ color: 'black', fontSize: 15 }}>{props.item.phone}</Text>
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

export default memo(ContactItem);
