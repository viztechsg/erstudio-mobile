import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Picker, Button, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Card, Badge, Overlay } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './styles';
import moment from 'moment';
import Swipeout from "react-native-swipeout";
import Icon from 'react-native-vector-icons/AntDesign';
import SwipeoutButton from '../../components/SwipeoutButton';

import { useDispatch, connect } from 'react-redux';
import { getLeadData, deleteLead } from '../../actions/leadAction';
import { store } from '../../store/store';
import SalesItem from '../../components/Sales/SalesItem';
import { getSalesData } from '../../actions/salesAction';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const SalesListScreen = (props) => {
    const { navigation } = props;

    // FILTER
    const [visible, setVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState("ready");
    const [defaultLabel, setDefaultLabel] = useState("");
    const [defaultLabel2, setDefaultLabel2] = useState("");
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [dateType, setDateType] = useState(1);

    const [salesData, setSalesData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    //const [selectedLead, setSelectedLead] = useState();

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        if (dateType == 1) {
            setDefaultLabel(currentDate);
        }
        else {
            setDefaultLabel2(currentDate);
        }

    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = (type) => {
        showMode('date');
        setDateType(type);
    };

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSalesData());
    }, []);

    store.subscribe(() => {
        setSalesData(store.getState().salesReducer.data);
    });

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        dispatch(getSalesData());
        wait(3000).then(() => setRefreshing(false))
    }, [refreshing]);

    const filterSales = () => {
        toggleOverlay();
        setRefreshing(true);
        dispatch(getSalesData(selectedValue, '', ''));
        wait(3000).then(() => setRefreshing(false));
    }

    const leadDeletePress = id => {
        Alert.alert(
            "Delete Lead",
            "Are you sure want to delete this lead?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log(id),
                    style: "cancel"
                },
                {
                    text: "OK", onPress: () => {
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
                            <Picker.Item label="Ready" value="ready" />
                            <Picker.Item label="Closed" value="closed" />
                        </Picker>
                    </View>
                    <View
                        style={{
                            marginTop: 10,
                        }}
                    >
                        <Text style={{ fontSize: 14, color: 'grey' }}>Date Range</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => showDatepicker(1)} style={{ width: '50%' }}>
                                <Picker
                                    style={{
                                        height: 50,
                                    }}
                                >
                                    <Picker.Item label={(typeof (defaultLabel) === 'object') ? moment(defaultLabel).format('DD-MM-YYYY') : defaultLabel} value="null" />
                                </Picker>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => showDatepicker(2)} style={{ width: '50%' }}>
                                <Picker
                                    style={{
                                        height: 50,
                                    }}
                                >
                                    <Picker.Item label={(typeof (defaultLabel2) === 'object') ? moment(defaultLabel2).format('DD-MM-YYYY') : defaultLabel2} value="null" />
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
                    <View style={styles.buttonSection}>
                        <TouchableOpacity style={styles.button} onPress={filterSales}>
                            <Text style={styles.textButton}>FILTER</Text>
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
            <View style={{ flex: 1, marginTop: 7, margin: -20}}>
                {
                    (salesData && salesData.length > 0) ?
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
                                <Swipeout
                                    right={[
                                        {
                                            component: <SwipeoutButton onDeletePress={() => leadDeletePress(item.id)} onEditPress={() => navigation.navigate('SalesEdit', { item: item })} />,
                                        }
                                    ]}
                                    autoClose
                                >
                                    <SalesItem item={item} status="follow" onViewPress={() => navigation.navigate('SalesView', { item: item })} />
                                </Swipeout>
                            )
                        }}
                    /> : <Text style={{width:"100%", backgroundColor:'lightgrey', textAlign:'center'}}>No data</Text>
                }

            </View>
        </View>
    )
}
export default connect(null, { getSalesData })(SalesListScreen);