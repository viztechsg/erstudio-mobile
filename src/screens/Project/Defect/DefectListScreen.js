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
import ProjectDefectItem from '../../../components/Project/ProjectDefectItem';
import { getProjectDefectList } from '../../../services/projectDefect';
import SelectPicker from '../../../components/SelectPicker';
import { getSowSource } from '../../../services/config';
import DefaultButton from '../../../components/DefaultButton';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const DefectListScreen = (props) => {
    const { navigation } = props;
    const { project } = navigation.state.params;
    const [visible, setVisible] = useState(false);
    const [defectList, setDefectList] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    // FILTER
    const [status, setStatus] = useState("");
    const [category, setCategory] = useState("");
    const [sow_id, setSowId] = useState("");
    const [sowOptions, setSowOptions] = useState([]);

    useEffect(() => {
        navigation.setParams({
            project_id: project.id,
            project
        });

        getSowSource().then((data) => {
            setSowOptions([]);
            data.data.map((value) => {
                setSowOptions((oldValue) => [
                    ...oldValue,
                    { label: value.name, value: value.id, key: value.name },
                ]);
            });
        });

        getProjectDefectList(project.id).then((data) => setDefectList(data));
    }, [project.id]);

    useEffect(() => {
        navigation.addListener('willFocus', () => {
            onRefresh();
        });
    }, [navigation]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getProjectDefectList(project.id).then((data) => setDefectList(data));
        wait(1000).then(() => setRefreshing(false))
    }, [refreshing]);

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    const filter = () => {
        toggleOverlay();
        setRefreshing(true);
        
        getProjectDefectList(project.id,status,category,sow_id).then((data) => setDefectList(data));

        wait(2000)
            .then(() => setRefreshing(false))
            .then(() => {
                setStatus("");
                setCategory('');
                setSowId("");
            });
    };

    const statusOptions = [
        {
            key:1,
            label: "Completed",
            value: "Inactive"
        },
        {
            key:2,
            label: "Ongoing",
            value: "Active"
        },
    ];

    const categoryOptions = [
        {
            label: "Pre-renovation",
            value: "Pre-renovation",
            key: 1
        },
        {
            label: "Defect",
            value: "Defect",
            key: 2
        },
        {
            label: "Handover",
            value: "Handover",
            key: 3
        },
    ];

    return (
        <View style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'stretch',
            padding: 20,
        }}>
            <Overlay
                isVisible={visible}
                onBackdropPress={toggleOverlay}
                overlayStyle={{ width: '80%' }}>
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
                            selectedValue={status}
                            options={statusOptions}
                            onSelect={(value) => setStatus(value)}
                        />
                    </View>
                    <View
                        style={{
                            marginTop: 10,
                        }}>
                        <Text style={{ fontSize: 14, color: 'grey', marginBottom: -10 }}>
                            Category
                        </Text>
                        <SelectPicker
                            key="CATEGORY_FILTER"
                            selectedValue={category}
                            options={categoryOptions}
                            onSelect={(value) => setCategory(value)}
                        />
                    </View>
                    <View
                        style={{
                            marginTop: 10,
                        }}>
                        <Text style={{ fontSize: 14, color: 'grey', marginBottom: -10 }}>
                            Scope of Work
                        </Text>
                        <SelectPicker
                            key="SOW_FILTER"
                            selectedValue={sow_id}
                            options={sowOptions}
                            onSelect={(value) => setSowId(value)}
                        />
                    </View>
                    <View
                        style={{
                            marginTop: 10,
                        }}>
                        <DefaultButton textButton="FILTER" onPress={() => filter()} />
                    </View>
                    
                </View>
            </Overlay>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '50%', justifyContent: 'flex-start' }}>
                    <Text style={{ color: 'grey', fontSize: 20 }}>Project Defects:</Text>
                    <Text style={{ color: 'grey', fontSize: 20 }}>{project.client_name}</Text>
                </View>
                <View style={{ width: '50%', justifyContent: 'flex-start' }}>
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
                    data={defectList}
                    renderItem={({ item }) => {
                        return (

                            <ProjectDefectItem item={item} status="follow" onViewPress={() => navigation.push('ProgressDefectView', { defect: item, project })} />
                        )
                    }}
                />
            </View>
        </View>
    )
}
export default connect(null, { getLeadData })(DefectListScreen);