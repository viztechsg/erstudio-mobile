import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, FlatList, Image } from 'react-native';
import styles from '../styles';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/FontAwesome'
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons'
const ProgressSinglePhotoScreen = ({ navigation }) => {
    const { item, categoryName, sow } = navigation.state.params;
    useEffect(() => {
        navigation.setParams({
            categoryName, 
            item,
            sow
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
                resizeMode='stretch'
                resizeMethod='resize'
            />
            <Text style={{color:'white', fontSize:16, marginTop:20}}>{item.remark}</Text>
            {/* Card components */}
        </View>
    )
}
export default ProgressSinglePhotoScreen;