import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Picker, Button, TouchableOpacity, Alert } from 'react-native';
import { Card, Badge, Overlay } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './styles';
import moment from 'moment';
import Swipeout from "react-native-swipeout";
import Icon from 'react-native-vector-icons/AntDesign';
import SwipeoutButton from '../../components/SwipeoutButton';

import {useDispatch, connect} from 'react-redux';
import {getLeadData, deleteLead} from '../../actions/leadAction';
import {store} from '../../store/store';
import ProjectItem from '../../components/Project/ProjectItem';
import { getSalesData } from '../../actions/salesAction';
import { RefreshControl } from 'react-native';
const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}
const ProjectListScreen = (props) => {
    const { navigation } = props;
    const [visible, setVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState("java");
    const [defaultLabel, setDefaultLabel] = useState("Start Date");

    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [salesData, setSalesData] = useState([]);

    const [leadsData, setLeadsData] = useState([]);
    //const [selectedLead, setSelectedLead] = useState();
    const [refreshing, setRefreshing] = useState(false);

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

    useEffect(() => {
        dispatch(getSalesData());
    }, []);

    useEffect(() => {
        navigation.addListener('willFocus', () => {
            // dispatch(getSalesData());
            onRefresh();
        });
    }, [navigation])

    store.subscribe(() => {
        setSalesData(store.getState().salesReducer.data);
    });

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        dispatch(getSalesData());
        wait(3000).then(() => setRefreshing(false))
    }, [refreshing]);
    

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
                    <Text style={{ color: 'grey', fontSize: 20 }}>Projects Table ({salesData.length})</Text>
                </View>
                <View style={{ width: '50%', justifyContent: 'flex-end' }}>
                    <TouchableOpacity style={{ backgroundColor: 'white', width: 150, height: 40, alignSelf: 'flex-end', justifyContent: 'center' }} onPress={toggleOverlay}>
                        <Text style={{ textAlign: 'center', letterSpacing: 1 }}>FILTER</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ flex: 1, marginTop: 7, margin: -20 }}>
                <FlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />}
                    keyExtractor={item => item.id.toString()}
                    data={salesData}
                    renderItem={({ item }) => {
                        return (
                                <ProjectItem item={item} status="follow" onViewPress={() => navigation.navigate('ProjectView',{ item: item })} />
                        )
                    }}
                />
            </View>
        </View>
    )
}
export default connect(null, { getLeadData })(ProjectListScreen);