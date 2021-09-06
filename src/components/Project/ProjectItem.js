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
const ProjectItem = props => {

    return (

        <TouchableOpacity onPress={() => props.onViewPress()}>
            <View style={styles.wrapper}>
                <View style={styles.col_1}>
                    <Text style={{ color: 'black', fontSize: 12 }}>
                        (project id)
                    </Text>
                    <Text style={{ color: 'black', fontSize: 16, marginTop: 10 }}>
                        {props.item.client_name}
                    </Text>
                </View>
                <View style={styles.col_2}>
                    <Text style={{ color: 'grey', fontSize: 10 }}>
                        Date created:
                    </Text>
                    <Text style={{ color: 'black', fontSize: 10 }}>
                        {moment(props.item.date).format('YYYY-MM-DD')}
                    </Text>
                </View>

            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: 'white',
        height: 100,
        padding: 10,
        flexDirection: 'row',
        margin: 1
    },
    col_1: {
        alignItems: 'flex-start',
        width: '60%'
    },
    col_2: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '40%',
        paddingRight: 10,
        flexDirection: 'row'
    }
});

export default ProjectItem;
