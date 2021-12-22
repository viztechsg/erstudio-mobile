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
const ProjectInspectionItem = props => {

    return (

        <TouchableOpacity onPress={() => props.onViewPress()}>
            <View style={styles.wrapper}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '50%', justifyContent: 'flex-start' }}>
                        <Text style={{ color: 'black', fontSize: 20 }}>{props.item.scope_of_work.name}</Text>
                        <Text style={{ color: 'black', fontSize: 14 }}>{props.item.vendor.name}</Text>
                    </View>
                    <View style={{ width: '50%', justifyContent: 'flex-start', alignItems:'flex-end' }}>
                        <View style={{ backgroundColor:(props.item.status == "passed") ? "green" : (props.item.status == "pending") ? "orange" : "red", width:'50%',padding:2, borderRadius:50, alignItems:'center'  }}>
                            <Text style={{color:'white', textTransform: "capitalize",fontSize: 12, }}>{props.item.status}</Text>
                        </View>
                        {/* <Badge
                            status={(props.item.status == "passed") ? "success" : (props.item.status == "pending") ? "warning" : "error" }
                            containerStyle={{}}
                            value={<Text style={{ color: 'white', margin: 15, fontSize: 12, textTransform: "capitalize" }}>{props.item.status}</Text>}
                        /> */}
                        <Text style={{ fontSize: 10, alignItems: 'flex-end', marginTop: 25 }}>
                            Date created: {moment(props.item.date).format('YYYY-MM-DD')}
                        </Text>
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

export default memo(ProjectInspectionItem);
