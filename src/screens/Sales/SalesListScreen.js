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
import { SafeAreaView } from 'react-native';
import DatePicker from '../../components/DatePicker';
import { getSalesList } from '../../services/sales';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const SalesListScreen = ({navigation}) => {
    // FILTER
    var dateFilter = new Date();
    var nextDay = dateFilter.setDate(dateFilter.getDate() + 1);
    const [visible, setVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState("ready");
    const [defaultLabel, setDefaultLabel] = useState(new Date());
    const [defaultLabel2, setDefaultLabel2] = useState(dateFilter);
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

    useEffect(() => {
        setRefreshing(true);
        getSalesList(
            '',
            '',
            '',
            navigation.getParam('needAction')
        ).then((data) => {setSalesData(data); setRefreshing(false);});;
        console.log(navigation)
    }, []);

    useEffect(() => {
        navigation.addListener('willFocus', () => {
            // dispatch(getSalesData());
            onRefresh();
        });
    }, [navigation])

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getSalesList(
            '',
            '',
            '',
            'no-need'
        ).then((data) => setSalesData(data));
        wait(3000).then(() => setRefreshing(false))
        console.log(navigation)
    }, [refreshing]);

    const renderListItem = ({ item }) => (
        <Swipeout
            right={[
                {
                    component: <SwipeoutButton onDeletePress={() => leadDeletePress(item.id)} onEditPress={() => navigation.navigate('SalesEdit', { item: item })} />,
                }
            ]}
        >
            <SalesItem item={item} status="follow" onViewPress={() => navigation.navigate('SalesView', { item: item })} />
        </Swipeout>
    );


    const filterSales = () => {
        toggleOverlay();
        setRefreshing(true);
        getSalesList(
            selectedValue,
            moment(defaultLabel).format('YYYY-MM-DD'),
            moment(defaultLabel2).format('YYYY-MM-DD'),
            'no-need'
        )
        .then((data) => setSalesData(data));

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
                        // dispatch(deleteLead(id))
                        // dispatch(getLeadData())
                        console.log("DELETED");
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
            <Overlay isVisible={visible} onBackdropPress={toggleOverlay} overlayStyle={{ width: '80%' }}>
                <View>
                    <Text style={{ fontSize: 20, color: 'grey' }}>Filter</Text>
                    <View
                        style={{
                            marginTop: 10,
                        }}
                    >
                        <Text style={{ fontSize: 14, color: 'grey' }}>Date Range</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: '50%' }}>
                                <DatePicker
                                    initialDate={defaultLabel}
                                    selectedDate={defaultLabel}
                                    onChange={(value) => setDefaultLabel(value)}
                                />
                            </View>
                            <View style={{ width: '50%' }}>
                                <DatePicker
                                    initialDate={defaultLabel2}
                                    selectedDate={defaultLabel2}
                                    onChange={(value) => { setDefaultLabel2(value) }}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={[styles.buttonSection, { marginVertical: 20 }]}>
                        <TouchableOpacity style={styles.button} onPress={filterSales}>
                            <Text style={styles.textButton}>FILTER</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Overlay>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '50%', justifyContent: 'flex-start' }}>
                    <Text style={{ color: 'grey', fontSize: 20 }}>Projects Table ({salesData?.length})</Text>
                </View>
                <View style={{ width: '50%', justifyContent: 'flex-end' }}>
                    <TouchableOpacity style={{ backgroundColor: 'white', width: 150, height: 40, alignSelf: 'flex-end', justifyContent: 'center' }} onPress={toggleOverlay}>
                        <Text style={{ textAlign: 'center', letterSpacing: 1 }}>FILTER</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <SafeAreaView style={{ flex: 1, marginTop: 7, margin: -20 }}>
                {
                    
                        <FlatList
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                />}
                            keyExtractor={(item) => item.id.toString()}
                            data={salesData}
                            removeClippedSubviews={true}
                            initialNumToRender={25}
                            updateCellsBatchingPeriod={50}
                            renderItem={renderListItem}
                        />
                }

            </SafeAreaView>
        </View>
    )
}
export default connect(null, { getSalesData })(SalesListScreen);