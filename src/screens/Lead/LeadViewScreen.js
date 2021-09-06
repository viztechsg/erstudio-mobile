import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Button, StyleSheet, CheckBox, SafeAreaView, TouchableOpacity, Picker } from 'react-native';
import TextField from '../../components/TextField';
import SelectPicker from '../../components/SelectPicker';
import LongText from '../../components/LongText';
import DefaultButton from '../../components/DefaultButton';
import Timeline from 'react-native-timeline-flatlist';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
//import styles from './styles';
import * as data from '../../dummy/data/leadsData';
import { Badge, Overlay } from 'react-native-elements';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import Appointment from '../../components/Lead/Appointment';
import { singleLead } from '../../services/lead';
import { getLeadData, deleteLead, resetData, updateLEad,createLead } from '../../actions/leadAction';
import { useDispatch, connect, useSelector } from 'react-redux';
const LeadViewScreen = (props) => {
    const {navigation} = props;
    const [visible, setVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState("java");
    const [defaultLabel, setDefaultLabel] = useState("Start Date");
    const [leadRemark, setLeadRemark] = useState([]);
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [remarks, setRemarks] = useState([]);
    const [data, setData] = useState([]);
    const toggleOverlay = () => {
        setVisible(!visible);
    };

    const { item } = navigation.state.params;


    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        setDefaultLabel(currentDate);
    };

    const initData =  () => {
        singleLead(item.id).then(singleData => setData(singleData));
        setRemarks([]);
        rebuildRemarkObject(item.remarks)

    }

    useEffect(() => {
        initData();
        navigation.setParams({
            item: item
        })
    }, [item.id])

    useEffect(() => {
        navigation.addListener('willFocus', () => {
            // singleLead(item.id).then(singleData => setData(singleData));
            initData();
        });
    }, [navigation, item.id]);

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const rebuildRemarkObject = (data) => {
        data.map((value) => {
            // setRemarks([...remarks, { time: moment(value.created_at).format("DD/MM/YYYY"), title: value.remarks }])
            setRemarks((oldValue) => [...oldValue, { time: moment(value.created_at).format("DD/MM/YYYY"), title: value.remarks }]);
        })
    }
    if (!data) return false;
    return (
        <View style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'stretch',
            //padding: 20,
            backgroundColor: '#F3F3F3',
        }}>
            <View style={{ flexDirection: 'row', padding: 20 }}>
                <View style={{ width: '50%' }}>
                    <Text style={{ fontSize: 20 }}>Lead: {data.client_name}</Text>
                </View>
                <View style={{ width: '50%', justifyContent: 'center', alignItems: 'flex-end' }}>
                    <Badge
                        status={(data.status == "successful") ? 'success' : 'warning'}
                        containerStyle={{ padding: 5 }}
                        value={<Text style={{ color: 'white', margin: 15, fontSize: 12 }}>{data.status}</Text>}
                    />
                </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ padding: 20, paddingTop: 0 }}>
                    <View style={styles.row}>
                        <View style={{ width: '50%' }}>
                            <Text style={styles.label}>Lead ID</Text>
                            <Text style={{ fontSize: 14 }}>{data.runner_no}</Text>
                        </View>
                        <View style={{ width: '50%', justifyContent: 'center', alignItems: 'flex-start' }}>
                            <Text style={styles.label}>Client Name</Text>
                            <Text style={{ fontSize: 14 }}>{data.client_name}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={{ width: '50%' }}>
                            <Text style={styles.label}>Contact number</Text>
                            <Text style={{ fontSize: 14 }}>{data.contact_number}</Text>
                        </View>
                        <View style={{ width: '50%', justifyContent: 'center', alignItems: 'flex-start' }}>
                            <Text style={styles.label}>Email</Text>
                            <Text style={{ fontSize: 14 }}>{data.email}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={{ width: '50%' }}>
                            <Text style={styles.label}>Leads created on</Text>
                            <Text style={{ fontSize: 14 }}>{moment(data.created_at).format("YYYY/MM/DD")}</Text>
                        </View>
                        <View style={{ width: '50%', justifyContent: 'center', alignItems: 'flex-start' }}>
                            <Text style={styles.label}>Address</Text>
                            <Text style={{ fontSize: 14 }}>{data.postal_code ? data.postal_code : "-"}</Text>
                            <Text style={{ fontSize: 14 }}>{data.residence ? data.residence : "-"}, {data.block_no ? data.block_no : "-"}</Text>
                            <Text style={{ fontSize: 14 }}>{data.road_name ? data.road_name : "-"}, {data.road_no ? data.road_no : "-"}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={{ width: '50%' }}>
                            <Text style={styles.label}>Property Type</Text>
                            <Text style={{ fontSize: 14 }}>{data.property_type?.name}</Text>
                        </View>
                        <View style={{ width: '50%', justifyContent: 'center', alignItems: 'flex-start' }}>
                            <Text style={styles.label}>Assigned To</Text>
                            <Text style={{ fontSize: 14 }}>{data.direct_salesman?.name}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={{ width: '50%' }}>
                            <Text style={styles.label}>Source</Text>
                            <Text style={{ fontSize: 14 }}>{data.master_source?.name}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={{ width: '50%' }}>
                            <Text style={styles.label}>Budget</Text>
                            <Text style={{ fontSize: 14 }}>$ {data.budget}</Text>
                        </View>
                    </View>
                </View>

                {/* Appointment */}
                <View style={{ padding: 20, marginTop: -15 }}>
                    <Text>Appointment</Text>
                </View>
                {

                    (data.appointment && data.appointment.length < 1) &&
                    (<View style={{ backgroundColor: '#B9B9B9', alignItems: 'center', justifyContent: 'center', height: 30, marginTop: -10 }}>
                        <Text style={{ color: '#808080' }}>No appointments made</Text>
                    </View>)
                }
                <View style={{ flexDirection: 'column' }}>
                    {
                        data.appointment && data.appointment.map((item, index) => {
                            return (<Appointment item={item} no={index + 1} onViewPress={() => console.log(index + 1)} />)
                        })
                    }
                </View>

                <View style={{
                    backgroundColor: 'white', padding: 30, margin: -20, marginTop: 15,
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: '50%' }}>
                            <Text style={{ marginTop: -20, marginLeft: 10 }}>Remark</Text>
                        </View>
                        {/* <View style={{ width: '50%', alignItems: 'flex-end' }}>
                            <Text style={{ marginTop: -20, marginLeft: 10, fontSize: 13, }}>View Details <Icon name="arrow-right" size={13} /></Text>
                        </View> */}
                    </View>

                    {
                        (remarks && remarks.length > 0) ?
                            (
                                <Timeline
                                    style={styles.list}
                                    data={remarks}
                                    circleSize={10}
                                    circleColor='grey'
                                    lineColor='grey'
                                    timeContainerStyle={{ minWidth: 93 }}
                                    timeStyle={{ textAlign: 'center', color: 'grey', marginTop: -5, marginBottom: 10 }}
                                    titleStyle={{ textAlign: 'left', color: 'grey', marginTop: -15, fontWeight: '100', fontSize: 14, marginBottom: 10 }}
                                    innerCircle={'dot'}
                                />
                            ) :
                            (
                                <View style={{ backgroundColor: '#f3f3f3', alignItems: 'center' }}>
                                    <Text>No remarks made</Text>
                                </View>
                            )

                    }

                </View>
            </ScrollView>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 65,
        backgroundColor: 'white'
    },
    list: {
        flex: 1,
        marginTop: 20,
        marginLeft: 20
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    descriptionContainer: {
        flexDirection: 'row',
        paddingRight: 50
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    textDescription: {
        marginLeft: 10,
        color: 'gray'
    },
    label: {
        fontSize: 14,
        color: 'grey',
    },
    row: {
        flexDirection: 'row',
        marginTop: 15,
    }
});
export default connect(null, { getLeadData,updateLEad,createLead })(LeadViewScreen);