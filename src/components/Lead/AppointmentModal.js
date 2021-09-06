import React, { useState } from "react";
import {
    Text,
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity
}
    from "react-native";
import { Card, Badge, Overlay } from 'react-native-elements';
import moment from 'moment';
const AppointmentModal = props => {

    return (

        <Overlay isVisible={props.visible} onBackdropPress={props.onBackdropPress()} overlayStyle={{ width: '80%', height: 400 }}>
            <View>
                <Text>TEST</Text>
            </View>
        </Overlay>
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

export default AppointmentModal;

