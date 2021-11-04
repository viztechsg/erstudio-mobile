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
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/AntDesign';
const SalesItem = props => {

    let textLabel = 'Quotation';
    let iconProvider = 'icon1';
    let icon = '';
    let iconColor = 'orange'

    if (props.item.lead.quotations.length < 1 && props.item.lead.quotations.customer_sign == null) {
        icon = 'error-outline'
    }
    // else if(props.item.lead.quotations.length > 0 && props.item.lead.quotations.customer_sign == null)
    // {
    //     icon = 'error-outline'
    // }
    else if(props.item.lead.quotations.length > 0)
    {
        props.item.lead.quotations.map((item,index) => {
            if(item.agreement?.length > 0 && !props.item.lead.handover)
            {
                icon = 'checkcircleo'
                iconColor = 'green'
                iconProvider = 'icon2'
                textLabel = "Agreement"
            }
            else if(props.item.lead.handover?.length > 0)
            {
                icon = 'checkcircleo'
                iconColor = 'green'
                iconProvider = 'icon2'
                textLabel = "Handover"
            }
            else{
                icon = 'checkcircleo'
                iconColor = 'green'
                iconProvider = 'icon2'
                textLabel = "Quotation"
            }
        })

    }


    return (

        <TouchableOpacity onPress={() => props.onViewPress()}>
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
                                {props.item.lead?.property_type.name}
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
                    <View style={{ flexDirection: 'row', justifyContent:'space-around' }}>
                        <View style={{ backgroundColor: 'black', borderRadius: 50, paddingVertical:2, paddingHorizontal:8, width:90, alignItems:'center',marginRight:5 }}>
                            <Text style={{ color: 'white',fontSize: 12, textTransform: "capitalize" }}>{textLabel}</Text>
                        </View>
                        <View style={{ backgroundColor: 'black', borderRadius: 10, justifyContent:'center', padding:1 }}>
                            {
                                (iconProvider == 'icon1') ? <Icon1 name={icon} size={20} color={iconColor} /> : <Icon2 name={icon} size={20} color={iconColor} />
                            }
                        </View>
                    </View>

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

export default memo(SalesItem);
