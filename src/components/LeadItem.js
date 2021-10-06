import React, {memo} from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Badge } from 'react-native-elements';
import moment from 'moment-business-time'
const LeadItem = (props) => {
    let badgeColor = '#FFC947';
    
    moment.locale('en', {
        workinghours: {
            0: null,
            1: ['08:00:00', '17:00:00'],
            2: ['08:00:00', '17:00:00'],
            3: ['08:00:00', '17:00:00'],
            4: ['08:00:00', '17:00:00'],
            5: ['08:00:00', '17:00:00'],
            6: null
        }
    });

    var startTime = props.item.created_at;

    var endTime = moment();
    var hours = moment(endTime).workingDiff(moment(startTime), 'hours', true);;

    if (props.item.status == 'followup') {
        badgeColor = 'orange';
    }

    if (props.item.status == 'successful') {
        badgeColor = 'green';
    }

    if (
        props.item.status == 'lost' ||
        props.item.status == 'void' ||
        props.item.status == 'return' ||
        props.item.status == 'failed'
    ) {
        badgeColor = '#AAAAAA';
    }

    if (
        hours > 4 &&
        props.item.remarks.length < 1 &&
        (props.item.status == 'newlead' ||
        props.item.status == 'reassign')
    ) {
        badgeColor = '#C91F37';
    }

    return (
        <TouchableOpacity onPress={() => props.onViewPress()}>
            <View style={styles.wrapper}>
                <View style={styles.col_1}>
                    <Text style={styles.smallText}>#{props.item.runner_no}</Text>
                    <Text
                        style={{
                            color: 'black',
                            fontSize: 16,
                            marginTop: 10,
                        }}>
                        {props.item.client_name}
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            marginTop: 5,
                            width: '100%',
                        }}>
                        <View
                            style={{
                                alignItems: 'flex-start',
                                width: '35%',
                            }}>
                            <Text
                                style={{
                                    color: 'black',
                                    fontSize: 14,
                                }}>
                                {props.item.property_type.name}
                            </Text>
                        </View>
                        <View
                            style={{
                                alignItems: 'flex-start',
                                width: '70%',
                                paddingVertical: 10,
                            }}>
                            <Text
                                style={{
                                    color: 'black',
                                    fontSize: 12,
                                    overflow: 'visible',
                                }}>
                                {props.item.email}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.col_2}>
                    <Badge
                        // status={(props.item.status == "successful") ? "success" : "warning"}
                        textStyle={{
                            color: 'white',
                            fontSize: 12,
                            textTransform: 'capitalize',
                        }}
                        badgeStyle={{ backgroundColor: badgeColor, width: 100 }}
                        value={
                            <Text
                                style={{
                                    color: 'white',
                                    fontSize: 12,
                                    textTransform: 'capitalize',
                                }}>
                                {props.item.status == 'failed' ? 'Return' : props.item.status}
                            </Text>
                        }
                    />
                    <Text
                        style={{
                            color: 'grey',
                            fontSize: 10,
                        }}>
                        Date created: {moment(props.item.created_at).format('YYYY-MM-DD')}
                    </Text>
                    <Text
                        style={{
                            fontSize: 14,
                            alignItems: 'flex-end',
                            marginTop: 25,
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
        margin: 1,
    },
    col_1: {
        alignItems: 'flex-start',
        width: '60%',
    },
    col_2: {
        alignItems: 'flex-end',
        width: '40%',
        paddingRight: 10,
    },
    smallText: {
        color: 'black',
        fontSize: 12,
    },
});

export default memo(LeadItem);
