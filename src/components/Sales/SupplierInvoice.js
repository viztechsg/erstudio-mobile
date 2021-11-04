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
const SupplierInvoice = props => {

    return (
        
        <TouchableOpacity onPress={() => props.onViewPress() }>
            <View style={styles.wrapper}>
                <View style={styles.col_1}>
                    <Text style={{fontSize:16, color:'#57ADD2'}}>{props.item.supplier_invoice_no}</Text>
                </View>
                <View style={styles.col_2}>
                    <Text style={{fontSize:10, justifyContent:'flex-end'}}>{moment(props.item.created_at).format("YYYY/MM/DD")}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: 'white',
        padding: 10,
        flexDirection: 'row',
        margin: 1,
        alignSelf:'stretch',
        flex:1,
    },
    col_1: {
        alignItems: 'flex-start',
        width:'100%'
    },
    col_2: {
        alignItems: 'flex-end',
        width:'50%'
        // paddingRight: 10
    }
});

export default memo(SupplierInvoice);
