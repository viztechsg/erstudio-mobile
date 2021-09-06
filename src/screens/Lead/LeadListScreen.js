import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Picker, Button, TouchableOpacity, Alert, RefreshControl, SafeAreaView, ActivityIndicator } from 'react-native';
import { Card, Badge, Overlay } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './styles';
import moment from 'moment';
import Swipeout from "react-native-swipeout";
import Icon from 'react-native-vector-icons/AntDesign';
import SwipeoutButton from '../../components/SwipeoutButton';
import LeadItem from '../../components/LeadItem';

import { useDispatch, connect, useSelector } from 'react-redux';
import { getLeadData, deleteLead, resetData, updateLEad,createLead } from '../../actions/leadAction';
import { store } from '../../store/store';
import { ScrollView } from 'react-native-gesture-handler';
import { allUsers } from '../../services/config';
import SelectPicker from '../../components/SelectPicker';


const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}


const LeadListScreen = (props) => {
    const { navigation } = props;
    const [visible, setVisible] = useState(false);

    // MODAL FILTER
    const [selectedValue, setSelectedValue] = useState("");
    const [allUser, setAllUser] = useState([]);
    const [defaultLabel, setDefaultLabel] = useState("");
    const [defaultLabel2, setDefaultLabel2] = useState("");
    const [selectedUser, setSelectedUser] = useState("");
    const [dateType, setDateType] = useState(1);

    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const [leadsData, setLeadsData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    //const [selectedLead, setSelectedLead] = useState();

    const fetchUser = () => {
        setAllUser([]);
        allUsers().then((data) => rebuildUserObject(data.data.data)).then(console.log(allUser));
    }

    const rebuildUserObject = (data) => {
        data.map((value) => {
            setAllUser((oldValue) => [...oldValue, { id: value.id, name: value.name }]);
        })
    }

    const filterStatus = [
        {
            label: 'New Lead',
            value: 'newlead'
        },
        {
            label: 'Follow Up',
            value: 'follow_up'
        },
        {
            label: 'Successful',
            value: 'successful'
        },
        {
            label: 'Failed',
            value: 'failed'
        },
        {
            label: 'Lost',
            value: 'lost'
        },
        {
            label: 'Void',
            value: 'void'
        },
        {
            label: 'Reassign',
            value: 'reassign'
        },
    ]

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    const filterLead = () => {
        toggleOverlay();
        setRefreshing(true);
        dispatch(getLeadData(selectedValue, '', '', selectedUser));
        wait(3000).then(() => setRefreshing(false));
    }

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
        dispatch(getLeadData('','','',''));
        fetchUser();
    },[]);

    useEffect(() => {
        const willFocusSubscription = navigation.addListener('willFocus', () => {
            dispatch(getLeadData('','','',''));
        });
    
        return willFocusSubscription;
    },[navigation]); 

    store.subscribe(() => {
        setLeadsData(store.getState().leadsReducer.data);
    });

    const handleDeleteLead = (id) => {
        dispatch(deleteLead(id));
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        dispatch(getLeadData('','','',''));
        wait(3000).then(() => setRefreshing(false))
    }, [refreshing]);

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
                        //dispatch(getLeadData())
                    }
                }
            ],
            { cancelable: true }
        );
    }
    if(!store.getState().leadsReducer.data) return false;
    return (
        <View style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'stretch',
            padding: 20,
        }}

        >
            {
                refreshing && (<ActivityIndicator />)
            }
            <Overlay isVisible={visible} onBackdropPress={toggleOverlay} overlayStyle={{ width: '80%', height: 400 }}>
                <View>
                    <Text style={{ fontSize: 20, color: 'grey' }}>Filter</Text>
                    <View
                        style={{
                            marginTop: 10,
                        }}
                    >
                        <Text style={{ fontSize: 14, color: 'grey' }}>Status</Text>
                        {<Picker
                            selectedValue={selectedValue}
                            style={{
                                height: 50,
                            }}
                            onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                        >
                            {
                                filterStatus.map((value, key) => {
                                    return (<Picker.Item label={value.label} value={value.value} key={key + 1} />)
                                })
                            }
                        </Picker>
                        }
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
                                    <Picker.Item label={(typeof (defaultLabel) === 'object') ? moment(defaultLabel).format('DD-MM-YYYY') : defaultLabel} value="null" key={defaultLabel} />
                                </Picker>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => showDatepicker(2)} style={{ width: '50%' }}>
                                <Picker
                                    style={{
                                        height: 50,
                                    }}
                                >
                                    <Picker.Item label={(typeof (defaultLabel2) === 'object') ? moment(defaultLabel2).format('DD-MM-YYYY') : defaultLabel2} value="null" key={defaultLabel2} />
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
                            marginBottom: 10,
                        }}
                    >
                        <Text style={{ fontSize: 14, color: 'grey' }}>Agents</Text>
                        <SelectPicker required={false}  options={allUser} selectedValue={selectedUser} onSelect={(data) => setSelectedUser(data)} />
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
                    <Text style={{ color: 'grey', fontSize: 20 }}>Leads Table ({leadsData.length})</Text>
                </View>
                <View style={{ width: '50%', justifyContent: 'flex-end' }}>
                    <TouchableOpacity style={{ backgroundColor: 'white', width: 150, height: 40, alignSelf: 'flex-end', justifyContent: 'center' }} onPress={toggleOverlay}>
                        <Text style={{ textAlign: 'center', letterSpacing: 1 }}>FILTER</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <SafeAreaView style={{ flex: 1, marginTop: 20, margin: -20, }} >
                <FlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />}
                    keyExtractor={item => item.id.toString()}
                    data={leadsData}
                    renderItem={({ item }) => {
                        return (
                            <Swipeout
                                right={[
                                    {
                                        component: <SwipeoutButton onDeletePress={() => leadDeletePress(item.id)} onEditPress={() => navigation.navigate('LeadEdit', { item: item })} />,
                                    }
                                ]}
                            >
                                <LeadItem item={item} status="follow" onViewPress={() => navigation.navigate('LeadView', { item: item })} />
                            </Swipeout>
                        )
                    }}
                />
            </SafeAreaView>
        </View>
    )
}
export default connect(null, { getLeadData,updateLEad,createLead })(LeadListScreen);