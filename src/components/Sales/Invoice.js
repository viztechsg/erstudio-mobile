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
const Invoice = props => {

    return (
        
        <TouchableOpacity onPress={() => props.onViewPress() }>
            <View style={styles.wrapper}>
                <View style={styles.col_1}>
                    <Text style={{fontSize:16, color:'#57ADD2'}}>Invoice ({props.item.running_no})</Text>
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
        width:'100%',
        flexDirection: 'row',
        margin: 1,
        alignSelf:'stretch'
    },
    col_1: {
        alignItems: 'flex-start',
        width:'70%'
    },
    col_2: {
        alignItems: 'flex-end',
        width:'30%'
        // paddingRight: 10
    }
});

export default memo(Invoice);
