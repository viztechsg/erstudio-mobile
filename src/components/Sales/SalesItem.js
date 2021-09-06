import React, {useState} from "react";
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
const SalesItem = props => {

    return (
        
        <TouchableOpacity onPress={() => props.onViewPress() }>
            <View style={styles.wrapper}>
                <View style={styles.col_1}>
                    <Text style={{ color: 'black', fontSize: 12 }}>
                        {props.item.project_no}
                    </Text>
                    <Text style={{ color: 'black', fontSize: 16, marginTop: 10 }}>
                        {props.item.client_name}
                    </Text>
                    <View style={{ flexDirection: 'row', marginTop: 5, width: '100%', }}>
                        <View style={{ alignItems: 'flex-start', width: '35%' }}>
                            <Text style={{ color: 'black', fontSize: 12 }}>
                                {props.item.lead?.property_type}
                            </Text>
                        </View>
                        <View style={{ alignItems: 'flex-end', width: '70%' }}>
                            <Text style={{ color: 'black', fontSize: 12, overflow: 'visible' }}>
                                {props.item.email}
                            </Text>
                        </View>
                    </View>

                </View>
                <View style={styles.col_2}>
                    <Badge
                        status={(props.item.status == "successful") ? "success" : "warning"}
                        containerStyle={{}}
                        value={<Text style={{ color: 'white', margin: 15, fontSize: 12, textTransform:"capitalize" }}>{props.item.status}</Text>}
                    />
                    <Text style={{ color: 'grey', fontSize: 10 }}>
                        Date created: {moment(props.item.created_at).format('YYYY-MM-DD')}
                    </Text>
                    <Text style={{ fontSize: 12, alignItems: 'flex-end', marginTop: 25 }}>
                        {props.item.contact_number}
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
        alignItems: 'flex-end',
        width: '40%',
        paddingRight: 10,
    }
});

export default SalesItem;
