import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, FlatList, Image } from 'react-native';
import styles from '../styles';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/FontAwesome'
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons'
import moment from 'moment';
const ProgressSinglePhotoScreen = ({ navigation }) => {
    const { item, categoryName, area_id, project_id, sow, comments } = navigation.state.params;
    useEffect(() => {
        console.log(item);
        navigation.setParams({
            categoryName, 
            item,
            sow,
            area_id,
            project_id
        });
    },[item.id]);
    return (
        <View style={{
            flex: 1,
            // flexDirection: 'row',
            // alignItems: 'stretch',
            //padding: 20,
            backgroundColor: '#060606',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Image
                style={{
                    height:350,
                    width:'100%'
                }}
                source={{ uri: item.path }}
                resizeMode='contain'
                resizeMethod='resize'
            />
            <Text style={{color:'white', fontSize:16, marginTop:20}}>{item.remark}</Text>
            <Text style={{color:'white', fontSize:16, marginTop:20}}>{comments}</Text>
            <Text style={{color:'white', fontSize:16, marginTop:20}}>{moment(item.capture_on).format('DD/MM/YYYY')}</Text>
            {/* Card components */}
        </View>
    )
}
export default ProgressSinglePhotoScreen;