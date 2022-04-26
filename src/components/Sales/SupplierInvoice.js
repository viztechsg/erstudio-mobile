import React, {useState, memo} from "react";
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
import { useEffect } from "react";
import { Platform } from "react-native";
import { Dimensions } from "react-native";
const SupplierInvoice = props => {
    useEffect(() => {
        console.log(props.item);
    }, [props.item.id])
    return (
        
        <TouchableOpacity onPress={() => props.onViewPress() }>
            <View style={styles.wrapper}>
                <View style={styles.col_1}>
                    <Text style={{fontSize:16, color:'#57ADD2'}}>{props.item.supplier?.vendor_name || "Vendor"}</Text>
                </View>
                <View style={styles.col_2}>
                    <Text style={{fontSize:10, justifyContent:'center'}}>{props.item.status}</Text>
                </View>
                <View style={styles.col_3}>
                    <Text style={{fontSize:10, justifyContent:'flex-end'}}>{moment(props.item.created_at).format("YYYY/MM/DD")}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: 'white',
        alignSelf:'stretch',
        padding: 10,
        flexDirection: 'row',
        margin: 1,
        flexWrap:'wrap',
    },
    col_1: {
        alignItems: 'flex-start',
        width: Platform.OS === "ios" ? '30%' : '33%'
    },
    col_2: {
        alignItems: 'center',
        width:Platform.OS === "ios" ? '30%' : '33%'
        // paddingRight: 10
    },
    col_3: {
        alignItems: 'flex-end',
        width:Platform.OS === "ios" ? '40%' : '33%'
        // paddingRight: 10
    }
});

export default memo(SupplierInvoice);
