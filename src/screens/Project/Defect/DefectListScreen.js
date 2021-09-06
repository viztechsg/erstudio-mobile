import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Picker, Button, TouchableOpacity, Alert } from 'react-native';
import { Card, Badge, Overlay } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../styles';
import moment from 'moment';
import Swipeout from "react-native-swipeout";
import Icon from 'react-native-vector-icons/AntDesign';
import SwipeoutButton from '../../../components/SwipeoutButton';
import LeadItem from '../../../components/LeadItem';

import {useDispatch, connect} from 'react-redux';
import {getLeadData, deleteLead} from '../../../actions/leadAction';
import {store} from '../../../store/store';
import ProjectInspectionItem from '../../../components/Project/ProjectInspectionItem';
import ProjectDefectItem from '../../../components/Project/ProjectDefectItem';

const DefectListScreen = (props) => {
    const { navigation } = props;
    const [visible, setVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState("java");
    const [defaultLabel, setDefaultLabel] = useState("Start Date");

    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const [leadsData, setLeadsData] = useState([]);
    //const [selectedLead, setSelectedLead] = useState();

    const defectList = [
        {
            id:1,
            area:'Dining',
            type:'Defect',
            sow: 'Flooring',
            status: 'passed',
            date: '10/02/2021',
            completion_date: '10/02/2021'
        },
        {
            id:2,
            area:'Dining',
            type:'Defect',
            sow: 'Partition',
            status: 'failed',
            date: '10/02/2021',
            completion_date: '10/02/2021'
        },
        {
            id:3,
            area:'Living Room',
            type:'Pre-renovation',
            sow: 'Flooring',
            status: 'passed',
            date: '10/02/2021',
            completion_date: '10/02/2021'
        },
    ]

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        setDefaultLabel(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const dispatch = useDispatch();

    const {data} = useDispatch(getLeadData());

    useEffect(() => {
        dispatch(getLeadData());
    },[data]);

    store.subscribe(()=>{
        setLeadsData(store.getState().leadsReducer.data);
    });

    const handleDeleteLead = (id) => {
        dispatch(deleteLead(id));
    }
    

    const leadDeletePress = id =>{
        Alert.alert(
            "Delete Lead",
            "Are you sure want to delete this lead?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log(id),
                    style: "cancel"
                },
                { text: "OK", onPress: () => {
                    dispatch(deleteLead(id))
                    dispatch(getLeadData())
                }
            }
            ],
            { cancelable: true }
        );
    }


    return (
        <View style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'stretch',
            padding: 20,
        }}>
            <Overlay isVisible={visible} onBackdropPress={toggleOverlay} overlayStyle={{ width: '80%', height: 400 }}>
                <View>
                    <Text style={{ fontSize: 20, color: 'grey' }}>Filter</Text>
                    <View
                        style={{
                            marginTop: 10,
                        }}
                    >
                        <Text style={{ fontSize: 14, color: 'grey' }}>Status</Text>
                        <Picker
                            selectedValue={selectedValue}
                            style={{
                                height: 50,
                            }}
                            onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                        >
                            <Picker.Item label="Follow Up" value="java" />
                            <Picker.Item label="Returned" value="js" />
                        </Picker>
                    </View>
                    <View
                        style={{
                            marginTop: 10,
                        }}
                    >
                        <Text style={{ fontSize: 14, color: 'grey' }}>Date Range</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={showDatepicker} style={{ width: '50%' }}>
                                <Picker
                                    style={{
                                        height: 50,
                                    }}
                                >
                                    <Picker.Item label={(typeof (defaultLabel) === 'object') ? moment(defaultLabel).format('DD-MM-YYYY') : defaultLabel} value="null" />
                                </Picker>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={showDatepicker} style={{ width: '50%' }}>
                                <Picker
                                    style={{
                                        height: 50,
                                    }}
                                >
                                    <Picker.Item label={(typeof (defaultLabel) === 'object') ? moment(defaultLabel).format('DD-MM-YYYY') : defaultLabel} value="null" />
                                </Picker>
                            </TouchableOpacity>
                        </View>

                        {show && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode={mode}
                                is24Hour={true}
                                display="default"
                                onChange={onChange}
                            />
                        )}
                    </View>
                    <View
                        style={{
                            marginTop: 10,
                        }}
                    >
                        <Text style={{ fontSize: 14, color: 'grey' }}>Agents</Text>
                        <Picker
                            selectedValue="Agents"
                            style={{
                                height: 50,
                            }}
                        >
                            <Picker.Item label="Agents" value="Agents" />
                        </Picker>
                    </View>
                    <View style={styles.buttonSection}>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
                            <Text style={styles.textButton} onPress={toggleOverlay}>FILTER</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Overlay>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '50%', justifyContent: 'flex-start' }}>
                    <Text style={{ color: 'grey', fontSize: 20 }}>Project Defects:</Text>
                    <Text style={{ color: 'grey', fontSize: 20 }}>Sam Ong</Text>
                </View>
                <View style={{ width: '50%', justifyContent: 'flex-start' }}>
                    <TouchableOpacity style={{ backgroundColor: 'white', width: 150, height: 40, alignSelf: 'flex-end', justifyContent: 'center' }} onPress={toggleOverlay}>
                        <Text style={{ textAlign: 'center', letterSpacing: 1 }}>FILTER</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ flex: 1, marginTop: 7, margin: -20 }}>
                <FlatList
                    keyExtractor={item => item.id.toString()}
                    data={defectList}
                    renderItem={({ item }) => {
                        return (
                            <Swipeout
                                right={[
                                    {
                                        component: <SwipeoutButton onDeletePress={() => console.log('DELETED')} onEditPress={() => navigation.push('ProgressDefectEdit')} />,
                                    }
                                ]}
                                autoClose
                            >
                                <ProjectDefectItem item={item} status="follow" onViewPress={() => navigation.push('ProgressDefectView')} />
                            </Swipeout>
                        )
                    }}
                />
            </View>
        </View>
    )
}
export default connect(null, { getLeadData })(DefectListScreen);