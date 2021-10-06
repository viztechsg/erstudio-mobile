import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    Picker,
    Button,
    TouchableOpacity,
    Alert,
    RefreshControl,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';
import { Card, Badge, Overlay } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './styles';
import moment from 'moment-business-time';
import Swipeout from 'react-native-swipeout';
import Icon from 'react-native-vector-icons/AntDesign';
import SwipeoutButton from '../../components/SwipeoutButton';
import LeadItem from '../../components/LeadItem';

import { useDispatch, connect, useSelector } from 'react-redux';
import {
    getLeadData,
    deleteLead,
    resetData,
    updateLEad,
    createLead,
} from '../../actions/leadAction';
import { store } from '../../store/store';
import { ScrollView } from 'react-native-gesture-handler';
import { allUsers } from '../../services/config';
import SelectPicker from '../../components/SelectPicker';
import DatePicker from '../../components/DatePicker';

const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
};

const LeadListScreen = (props) => {
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
    var date = new Date();
    var nextDay = date.setDate(date.getDate() + 1);
    const { navigation } = props;
    const [visible, setVisible] = useState(false);
    const { filterStatus, needAttention } = navigation.state.params;
    // MODAL FILTER
    const [selectedValue, setSelectedValue] = useState('');
    const [allUser, setAllUser] = useState([]);
    const [defaultLabel, setDefaultLabel] = useState(new Date());
    const [defaultLabel2, setDefaultLabel2] = useState(nextDay);
    const [selectedUser, setSelectedUser] = useState(null);
    const [dateType, setDateType] = useState(1);

    const [leadsData, setLeadsData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    //const [selectedLead, setSelectedLead] = useState();

    const fetchUser = () => {
        setAllUser([]);
        allUsers().then((data) => rebuildUserObject(data.data.data));
    };

    const rebuildUserObject = (data) => {
        data.map((value) => {
            setAllUser((oldValue) => [
                ...oldValue,
                { label: value.name, value: value.id, key: value.name },
            ]);
        });
    };

    const statusOption = [
        {
            value: 'newlead',
            label: 'New Lead',
            key: 'New Lead',
        },
        {
            value: 'followup',
            label: 'Follow Up',
            key: 'Follow Up',
        },
        {
            value: 'return',
            label: 'Failed',
            key: 'Failed',
        },
        {
            value: 'successful',
            label: 'Successful',
            key: 'Successful',
        },
        {
            value: 'failed',
            label: 'Return',
            key: 'Return',
        },
        {
            value: 'reassign',
            label: 'Reassign',
            key: 'Reassign',
        },
        {
            value: 'lost',
            label: 'Lost',
            key: 'Lost',
        },
    ];

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    const filterLead = () => {
        toggleOverlay();
        setRefreshing(true);
        dispatch(
            getLeadData(
                selectedValue == null ? '' : selectedValue,
                moment(defaultLabel).format('YYYY-MM-DD'),
                moment(defaultLabel2).format('YYYY-MM-DD'),
                selectedUser == null ? '' : selectedUser
            )
        );
        // navigation.setParams({filterStatus : selectedValue})
        wait(3000)
            .then(() => setRefreshing(false))
            .then(() => {
                setSelectedUser(null);
                setSelectedValue('');
            });
    };

    const dispatch = useDispatch();

    useEffect(() => {
        fetchUser();
        dispatch(
            getLeadData(
                navigation.getParam('filterStatus', ''),
                '',
                '',
                selectedUser == null ? '' : selectedUser
            )
        );
        // rebuildNewLeadData();
    }, [filterStatus,needAttention, navigation]);

    const rebuildNewLeadData = (data) => {
        let item = [];
        var endTime = moment();
        if (navigation.getParam('filterStatus', '') == "newlead" || navigation.getParam('filterStatus', '') == "reassign") {
            if (navigation.getParam('needAttention', '') == "newlead-need") {
                
                data.map((value, index) => {
                    var hours = moment(endTime).workingDiff(moment(value.created_at), 'hours', true);
                    if (hours >= 4 && value.remarks.length < 1) {
                        item.push(value);
                    }
                });
            }
            else{
                data.map((value, index) => {
                    var hours = moment(endTime).workingDiff(moment(value.created_at), 'hours', true);
                    if (hours < 4) {
                        item.push(value);
                    }
                });
            }
        }
        else{
            item = data;
        }

        return item;
    }

    store.subscribe(() => {
        setLeadsData(rebuildNewLeadData(store.getState().leadsReducer.data));
    });

    const handleDeleteLead = (id) => {
        dispatch(deleteLead(id));
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        dispatch(getLeadData('', '', '', ''));
        navigation.setParams({ filterStatus: ''});
        wait(3000).then(() => setRefreshing(false));
    }, [refreshing]);

    const leadDeletePress = (id) => {
        Alert.alert(
            'Delete Lead',
            'Are you sure want to delete this lead?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log(id),
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => {
                        dispatch(deleteLead(id));
                        //dispatch(getLeadData())
                    },
                },
            ],
            { cancelable: true }
        );
    };
    if (!store.getState().leadsReducer.data) return false;
    return (
        <View
            style={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'stretch',
                padding: 20,
            }}>
            {refreshing && <ActivityIndicator />}
            <Overlay
                isVisible={visible}
                onBackdropPress={toggleOverlay}
                overlayStyle={{ width: '80%', height: 400 }}>
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
                            selectedValue={selectedValue}
                            options={statusOption}
                            onSelect={(value) => setSelectedValue(value)}
                        />
                    </View>
                    <View
                        style={{
                            marginTop: 10,
                        }}>
                        <Text style={{ fontSize: 14, color: 'grey' }}>Date Range</Text>
                        <View style={{ flexDirection: 'row', marginTop: -10 }}>
                            <View style={{ width: '50%' }}>
                                <DatePicker
                                    selectedDate={defaultLabel}
                                    onChange={(value) => setDefaultLabel(value)}
                                />
                            </View>
                            <View style={{ width: '50%' }}>
                                <DatePicker
                                    selectedDate={defaultLabel2}
                                    onChange={(value) => { setDefaultLabel2(value); console.log(value) }}
                                />
                            </View>
                        </View>
                    </View>
                    <View
                        style={{
                            marginBottom: 10,
                        }}>
                        <Text
                            style={{
                                fontSize: 14,
                                color: 'grey',
                                marginTop: 10,
                                marginBottom: -10,
                            }}>
                            Agents
                        </Text>
                        <SelectPicker
                            key="ALL_USER_FILTER"
                            required={false}
                            options={allUser}
                            selectedValue={selectedUser}
                            onSelect={(data) => setSelectedUser(data)}
                        />
                    </View>
                    <View style={styles.buttonSection}>
                        <TouchableOpacity style={styles.button} onPress={filterLead}>
                            <Text style={styles.textButton}>FILTER</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Overlay>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '50%', justifyContent: 'flex-start' }}>
                    <Text style={{ color: 'grey', fontSize: 20 }}>
                        Leads Table ({leadsData.length})
                    </Text>
                </View>
                <View style={{ width: '50%', justifyContent: 'flex-end' }}>
                    <TouchableOpacity
                        style={{
                            backgroundColor: 'white',
                            width: 150,
                            height: 40,
                            alignSelf: 'flex-end',
                            justifyContent: 'center',
                        }}
                        onPress={toggleOverlay}>
                        <Text style={{ textAlign: 'center', letterSpacing: 1 }}>
                            FILTER
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <SafeAreaView style={{ flex: 1, marginTop: 20, margin: -20 }}>
                <FlatList
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    keyExtractor={(item) => item.id.toString()}
                    data={leadsData}
                    renderItem={({ item }) => {
                        return (
                            <Swipeout
                                right={[
                                    {
                                        component: (
                                            <SwipeoutButton
                                                onDeletePress={() => leadDeletePress(item.id)}
                                                onEditPress={() =>
                                                    navigation.navigate('LeadEdit', { item: item })
                                                }
                                            />
                                        ),
                                    },
                                ]}>
                                <LeadItem
                                    item={item}
                                    status="follow"
                                    onViewPress={() =>
                                        navigation.navigate('LeadView', { item: item })
                                    }
                                />
                            </Swipeout>
                        );
                    }}
                />
            </SafeAreaView>
        </View>
    );
};
export default connect(null, { getLeadData, updateLEad, createLead })(
    LeadListScreen
);
