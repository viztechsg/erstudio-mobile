import React, { useState, useEffect, useCallback } from "react";
import { Text, StyleSheet, View, TouchableOpacity, Image, ScrollView, RefreshControl } from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/FontAwesome'
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons'
import generalStyle from '../../general/Styles/generalStyle'
import styles from './styles';
import AppointmentItem from "../../components/Home/AppointmentItem";
import { dashboardData } from "../../services/dashboard";
import { store } from "../../store/store";

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const HomeScreen2 = (props) => {
    const [dashboard, setDashboard] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        dashboardData().then((data) => data).then(response => setDashboard(response));
    }, [])

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        dashboardData().then((data) => data).then(response => setDashboard(response));
        wait(3000).then(() => setRefreshing(false))
    }, [refreshing]);

    if (!dashboard) return false
    return (
        <View style={generalStyle.bodyContainer}>
            {/* Header */}
            <View style={styles.wrapper}>
                <View style={[styles.item, { alignItems: 'flex-start', width: '20%' }]}>
                    <View style={styles.roundedContainer}>
                        <Image source={{ uri: "https://reactjs.org/logo-og.png" }} style={{ width: 55, height: 55 }} />
                    </View>
                </View>
                <View style={[styles.item, { alignItems: 'flex-start' }]}>
                    <Text style={styles.heading}>{store.getState().loginReducer.name}</Text>
                    <Text style={styles.labelText}>{store.getState().loginReducer.role}</Text>
                </View>
                <View style={[styles.item, { alignItems: 'flex-end' }]}>
                    <TouchableOpacity>
                        <Icon name="ellipsis1" size={40} color='black' />
                    </TouchableOpacity>

                </View>
            </View>
            {/* Card components */}
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />}>
                <View style={[styles.wrapper2, { backgroundColor: 'transparent' }]}>
                    <View style={styles.card}>
                        <View style={styles.cardContent}>
                            <Icon3 name="new-box" size={25} color='#FFE605' />
                            <Text style={{ fontSize: 16, color: '#FFE605', fontWeight: 'bold' }}>New Leads</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ width: '35%' }}>
                                <Text style={styles.innerWhiteText}>{dashboard ?.new_leads}</Text>
                                <Text style={{ fontSize: 15, color: 'white' }}>Total</Text>
                            </View>
                            <View style={{ width: '65%' }}>
                                <Text style={{ fontSize: 30, color: '#F86D6D' }}>{dashboard ?.need_attention}</Text>
                                <Text style={{ fontSize: 13, color: '#F86D6D' }}>Need Attention</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.card}>
                        <View style={styles.cardContent}>
                            <Icon2 name="suitcase" size={25} color='#F49C37' />
                            <Text style={{ fontSize: 16, color: '#F49C37', fontWeight: 'bold' }}>To Follow Up</Text>
                        </View>
                        <View>
                            <Text style={styles.innerWhiteText}>{dashboard ?.followup_leads}</Text>
                            <Text style={{ fontSize: 15, color: 'white' }}>Total</Text>
                        </View>
                    </View>
                </View>
                <View style={[styles.wrapper2, { backgroundColor: 'transparent' }]}>
                    <View style={styles.card}>
                        <View style={styles.cardContent}>
                            <Icon name="back" size={25} color='#B2B2B2' />
                            <Text style={{ fontSize: 16, color: '#B2B2B2', fontWeight: 'bold' }}>Yearly Leads</Text>
                        </View>
                        <View>
                            <Text style={styles.innerWhiteText}>{dashboard ?.return_lead}</Text>
                            <Text style={{ fontSize: 15, color: 'white' }}>Total</Text>
                        </View>
                    </View>
                    <View style={styles.card}>
                        <View style={styles.cardContent}>
                            <Icon2 name="check" size={25} color='#1DBE16' />
                            <Text style={{ fontSize: 16, color: '#1DBE16', fontWeight: 'bold' }}>Successful Leads</Text>
                        </View>
                        <View>
                            <Text style={styles.innerWhiteText}>{dashboard ?.success_leads}</Text>
                            <Text style={{ fontSize: 15, color: 'white' }}>Total</Text>
                        </View>
                    </View>
                </View>

                {/* Appointment component */}
                <View style={[styles.wrapper2, { backgroundColor: 'transparent' }]}>
                    <View style={[styles.card, { width: '99%', padding: 10, borderRadius: 5, height: 220 }]}>

                        <View>
                            <Text style={{ color: 'white' }}>Appointment</Text>
                        </View>
                        <View style={{ marginTop: 5, flex: 1 }}>
                            <ScrollView>
                                {dashboard.appointments &&
                                    Object.entries(dashboard.appointments).map((item) => {
                                        return (<AppointmentItem onViewPress={() => console.log(item[1])} item={item[1]} />)
                                    })

                                }
                            </ScrollView>
                        </View>

                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default HomeScreen2;

