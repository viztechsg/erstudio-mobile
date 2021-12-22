import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Picker, Button, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Card, Badge, Overlay } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../styles';
import moment from 'moment';
import Swipeout from "react-native-swipeout";
import Icon from 'react-native-vector-icons/AntDesign';
import SwipeoutButton from '../../../components/SwipeoutButton';
import LeadItem from '../../../components/LeadItem';

import { useDispatch, connect } from 'react-redux';
import { getLeadData, deleteLead } from '../../../actions/leadAction';
import { store } from '../../../store/store';
import ProjectInspectionItem from '../../../components/Project/ProjectInspectionItem';
import { getProjectInspectionList } from '../../../services/projectInspection';
import SelectPicker from '../../../components/SelectPicker';
import DefaultButton from '../../../components/DefaultButton';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}
const InspectionListScreen = (props) => {
    const { navigation } = props;
    const { item } = navigation.state.params;
    const [visible, setVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [inspectionData, setInspectionData] = useState([]);

    // FILTER
    const [modalFilter, setModalFilter] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const status = [
        {
            id:"Pending",
            label: "Pending",
            value: "pending"
        },
        {
            id:"Passed",
            label: "Passed",
            value: "passed"
        },
        {
            id:"Failed",
            label: "Failed",
            value: "failed"
        },
    ]

    useEffect(() => {
        navigation.setParams({
            project_id: item.id
        });

        getProjectInspectionList(item.id).then((data) => setInspectionData(data));
    }, [item.id]);

    useEffect(() => {
        navigation.addListener('willFocus', () => {
            onRefresh();
        });
    }, [navigation]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getProjectInspectionList(item.id).then((data) => setInspectionData(data));
        wait(1000).then(() => setRefreshing(false))
    }, [refreshing]);

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    const toggleFilter = () => {
        setModalFilter(!modalFilter);
    };

    const filterInspection = () => {
        toggleFilter();
        setRefreshing(true);
        getProjectInspectionList(item.id,selectedStatus).then((data) => setInspectionData(data));
        wait(1000).then(() => setRefreshing(false))
    }

    return (
        <View style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'stretch',
            padding: 20,
        }}>
            <Overlay
                isVisible={modalFilter}
                onBackdropPress={toggleFilter}
                overlayStyle={{ width: '80%', height: 250 }}>
                <View>
                    <Text style={{ fontSize: 20, color: 'grey' }}>Filter</Text>
                    <View
                        style={{
                            marginTop: 10,
                        }}>
                        <Text style={{ fontSize: 14, color: 'grey', marginBottom: -10 }}>
                            Status
                        </Text>
                        <SelectPicker
                            key="STATUS_FILTER"
                            selectedValue={selectedStatus}
                            options={status}
                            onSelect={(value) => setSelectedStatus(value)}
                        />
                    </View>
                    <View>
                        <DefaultButton onPress={() => filterInspection()} textButton="FILTER"  />
                    </View>
                </View>
            </Overlay>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '50%', justifyContent: 'flex-start' }}>
                    <Text style={{ color: 'grey', fontSize: 20 }}>Project Inspection:</Text>
                    <Text style={{ color: 'grey', fontSize: 20 }}>{item.client_name}</Text>
                </View>
                <View style={{ width: '50%', justifyContent: 'flex-start' }}>
                    <TouchableOpacity style={{ backgroundColor: 'white', width: 150, height: 40, alignSelf: 'flex-end', justifyContent: 'center' }} onPress={toggleFilter}>
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
                    data={inspectionData}
                    renderItem={({ item }) => {
                        return (
                            <Swipeout
                                right={[
                                    {
                                        component: <SwipeoutButton onDeletePress={() => console.log('DELETED')} onEditPress={() => navigation.push('ProgressInspectionEdit',{project_id:item.project_id,item:item})} />,
                                    }
                                ]}
                                autoClose
                            >
                                <ProjectInspectionItem item={item} status="follow" onViewPress={() => console.log('VIEWED')} />
                            </Swipeout>
                        )
                    }}
                />
            </View>
        </View>
    )
}
export default connect(null, { getLeadData })(InspectionListScreen);