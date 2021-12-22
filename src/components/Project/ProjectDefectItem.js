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
const ProjectDefectItem = props => {

    return (

        <TouchableOpacity onPress={() => props.onViewPress()}>
            <View style={styles.wrapper}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <View style={{ width: '50%', justifyContent: 'flex-start' }}>
                        <Text style={{ color: 'black', fontSize: 20 }}>{props.item.category}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 10 }}>
                            <Text style={{ color: 'grey', fontSize: 16 }}>{props.item.area?.name}</Text>
                            <Text style={{ color: 'grey', fontSize: 16, marginLeft: 15 }}>{props.item.scope_of_work?.name}</Text>
                        </View>

                    </View>
                    <View style={{ width: '50%', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 9, alignItems: 'flex-end', marginTop: 15 }}>
                            Creation date: {moment(props.item.created_at).format('YYYY-MM-DD')}
                        </Text>
                        {
                            props.item.complete_date && (
                                <Text style={{ fontSize: 9, alignItems: 'flex-end' }}>
                                    Completion date: {moment(props.item.complete_date).format('YYYY-MM-DD')}
                                </Text>
                            )
                        }

                    </View>
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
        alignItems: 'flex-end',
        width: '40%',
        paddingRight: 10
    }
});

export default memo(ProjectDefectItem);
