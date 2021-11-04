import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import styles from './styles';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/FontAwesome'
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons'
const ProjectViewScreen = ({ navigation }) => {
    const {item} = navigation.state.params;
    return (
        <View style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'stretch',
            //padding: 20,
            backgroundColor: '#F3F3F3',
        }}>
            <View style={{ flexDirection: 'row', padding: 20 }}>
                <View style={{ width: '50%' }}>
                    <Text style={{ fontSize: 20 }}>Choose an action</Text>
                </View>
            </View>
            {/* Card components */}
            <View style={{ padding: 20 }}>
                <View style={[styles.wrapper2, { backgroundColor: 'transparent' }]}>
                    <TouchableOpacity onPress={() => navigation.push('ProjectProgress',{item:item})} style={styles.card}>
                        <View style={{ alignItems: 'center' }} >
                            <Icon3 name="progress-check" size={60} color='white' />
                            <Text style={{ color: 'white', fontSize: 18, marginTop: 10 }}>PROGRESS</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.push('ProgressInspectionList')} style={styles.card}>
                        <View style={{ alignItems: 'center' }}>
                            <Icon name="search1" size={60} color='white' />
                            <Text style={{ color: 'white', fontSize: 18, marginTop: 10 }}>INSPECTION</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={[styles.wrapper2, { backgroundColor: 'transparent' }]}>
                    <TouchableOpacity onPress={() => navigation.push('ProgressDefectList')} style={styles.card}>
                        <View style={{ alignItems: 'center' }}>
                            <Icon3 name="image-broken-variant" size={60} color='white' />
                            <Text style={{ color: 'white', fontSize: 18, marginTop: 10 }}>DEFECTS</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={[styles.card, { backgroundColor: 'transparent' }]}>

                    </View>
                </View>
            </View>
        </View>
    )
}
export default ProjectViewScreen;