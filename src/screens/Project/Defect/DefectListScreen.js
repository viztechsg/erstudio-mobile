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

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const DefectListScreen = (props) => {
    const { navigation } = props;
    const { project } = navigation.state.params;
    const [visible, setVisible] = useState(false);
    const [defectList, setDefectList] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    useEffect(() => {
        navigation.setParams({
            project_id: project.id,
            project
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

    return (
        <View style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'stretch',
            padding: 20,
        }}>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '50%', justifyContent: 'flex-start' }}>
                    <Text style={{ color: 'grey', fontSize: 20 }}>Project Defects:</Text>
                    <Text style={{ color: 'grey', fontSize: 20 }}>{project.client_name}</Text>
                </View>
                <View style={{ width: '50%', justifyContent: 'flex-start' }}>
                    <TouchableOpacity style={{ backgroundColor: 'white', width: 150, height: 40, alignSelf: 'flex-end', justifyContent: 'center' }} onPress={() => console.log("Pressed")}>
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

                                <ProjectDefectItem item={item} status="follow" onViewPress={() => navigation.push('ProgressDefectView',{defect:item,project})} />
                        )
                    }}
                />
            </View>
        </View>
    )
}
export default connect(null, { getLeadData })(DefectListScreen);