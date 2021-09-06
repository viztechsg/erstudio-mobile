import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, FlatList, Image } from 'react-native';
import styles from '../styles';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/FontAwesome'
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons'
const PhotoDetailScreen = ({ navigation }) => {
    return (
        <View style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'stretch',
            //padding: 20,
            backgroundColor: '#060606',
        }}>
            <View style={{ padding: 20 }}>
                <View>
                    <Text style={{ fontSize: 20, color: 'white' }}>Details</Text>
                </View>
                <View style={{ marginTop: 18 }}>
                    <Text style={{ fontSize: 18, color: 'grey' }}>Area</Text>
                    <Text style={{ fontSize: 18, color: 'white' }}>Kitchen</Text>
                </View>
                <View style={{ marginTop: 18 }}>
                    <Text style={{ fontSize: 18, color: 'grey' }}>Service</Text>
                    <Text style={{ fontSize: 18, color: 'white' }}>Kitchen</Text>
                </View>
                <View style={{ marginTop: 18 }}>
                    <Text style={{ fontSize: 18, color: 'grey' }}>Photo uploaded on</Text>
                    <Text style={{ fontSize: 18, color: 'white' }}>Kitchen</Text>
                </View>
                <View style={{ marginTop: 18 }}>
                    <Text style={{ fontSize: 18, color: 'grey' }}>Photo taken on</Text>
                    <Text style={{ fontSize: 18, color: 'white' }}>Kitchen</Text>
                </View>
                <View style={{ marginTop: 18 }}>
                    <Text style={{ fontSize: 18, color: 'grey' }}>Remarks</Text>
                    <Text style={{ fontSize: 18, color: 'white' }}>Kitchen</Text>
                </View>
            </View>
            {/* Card components */}
        </View>
    )
}
export default PhotoDetailScreen;