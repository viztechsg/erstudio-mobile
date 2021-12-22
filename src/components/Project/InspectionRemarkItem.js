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
import Icon from 'react-native-vector-icons/AntDesign';
const InspectionRemarkItem = props => {
    return (
        <TouchableOpacity onPress={() => props.onViewPress()}>
            <View style={styles.wrapper}>
                {/* HEADER */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-around'}}>
                    <View style={{ width: '40%' }}>
                        <Text style={styles.textSize}>{props.designer || "-"}</Text>
                    </View>
                    <View style={{ width: '23%', alignItems: 'flex-end' }}>
                        <Text style={styles.textSize}>{moment(props.item.created_at).format('DD/MM/YYYY') || "-"}</Text>
                    </View>
                    <View style={{ width: '19%', alignItems: 'flex-end' }}>
                        <Text style={styles.textSize}>{props.item.status || "pending"}</Text>
                    </View>
                    <View style={{ width: '19%', alignItems: 'flex-end' }}>
                        <TouchableOpacity>
                            <Icon name="ellipsis1" size={25} color='grey' />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* BODY */}
                <View style={{ marginVertical: 10 }}>
                    <Text style={[styles.textSize]}>
                        {props.item.remark}
                    </Text>
                    <Text style={[styles.textSize, { marginTop: 10 }]}>
                        Vendor(s): 
                        {
                            props.item.vendors.join(', ')
                        }
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: 'white',
        padding: 10,
        margin: 1,
        color: 'grey'
    },
    col_1: {
        alignItems: 'flex-start',
        width: '60%'
    },
    col_2: {
        alignItems: 'flex-end',
        width: '40%',
        paddingRight: 10
    },
    textSize: {
        fontSize: 13,
        fontWeight:'800'
    }
});

export default InspectionRemarkItem;
