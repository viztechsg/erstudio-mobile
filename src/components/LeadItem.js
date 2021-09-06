import React from "react";
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity
}
    from "react-native";
import { Badge } from 'react-native-elements';
import moment from 'moment';
const LeadItem = props => {

    let badgeColor = '#FFC947';

    if(props.item.status == 'follow_up')
    {
        badgeColor = 'orange'
    }
    
    if(props.item.status == 'successful')
    {
        badgeColor = 'green'
    }

    if(props.item.status == 'lost' || props.item.status == 'void' || props.item.status == 'return')
    {
        badgeColor = '#AAAAAA'
    }

    return (

        <TouchableOpacity onPress={() => props.onViewPress()}>
            <View style={styles.wrapper}>
                <View style={styles.col_1}>
                    <Text style={styles.smallText}>
                        #{props.item.runner_no}
                    </Text>
                    <Text style={{
                        color: 'black',
                        fontSize: 16,
                        marginTop: 10
                    }}>
                        {props.item.client_name}
                    </Text>
                    <View style={{
                        flexDirection: 'row',
                        marginTop: 5,
                        width: '100%',
                    }}>
                        <View style={{
                            alignItems: 'flex-start',
                            width: '35%'
                        }}>
                            <Text style={{
                                color: 'black',
                                fontSize: 14
                            }}>
                                {props.item.property_type.name}
                            </Text>
                        </View>
                        <View style={{
                            alignItems: 'flex-start',
                            width: '70%',
                            paddingVertical: 10
                        }}>
                            <Text style={{
                                color: 'black',
                                fontSize: 12,
                                overflow: 'visible'
                            }}>
                                {props.item.email}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.col_2}>
                    <Badge
                        // status={(props.item.status == "successful") ? "success" : "warning"}
                        badgeStyle={{backgroundColor:badgeColor, width:100}}
                        value={
                            <Text style={{
                                color: 'white',
                                fontSize: 12,
                                textTransform: "capitalize"
                            }}>
                                {props.item.status}
                            </Text>
                        }
                    />
                    <Text style={{
                        color: 'grey',
                        fontSize: 10
                    }}>
                        Date created: {moment(props.item.created_at).format('YYYY-MM-DD')}
                    </Text>
                    <Text style={{
                        fontSize: 14,
                        alignItems: 'flex-end',
                        marginTop: 25
                    }}>
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
    },
    smallText: {
        color: 'black',
        fontSize: 12
    }
});

export default LeadItem;
