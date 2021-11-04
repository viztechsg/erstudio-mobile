import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, FlatList, Image } from 'react-native';
import moment from 'moment';
const PhotoDetailScreen = ({ navigation }) => {
    const {item, categoryName, sow} = navigation.state.params;
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
                    <Text style={{ fontSize: 18, color: 'white' }}>{categoryName}</Text>
                </View>
                <View style={{ marginTop: 18 }}>
                    <Text style={{ fontSize: 18, color: 'grey' }}>Service</Text>
                    <Text style={{ fontSize: 18, color: 'white' }}>{sow}</Text>
                </View>
                <View style={{ marginTop: 18 }}>
                    <Text style={{ fontSize: 18, color: 'grey' }}>Photo uploaded on</Text>
                    <Text style={{ fontSize: 18, color: 'white' }}>{moment(item.created_at).format('DD-MM-YYYY')}</Text>
                </View>
                <View style={{ marginTop: 18 }}>
                    <Text style={{ fontSize: 18, color: 'grey' }}>Photo taken on</Text>
                    <Text style={{ fontSize: 18, color: 'white' }}>{moment(item.capture_on).format('DD-MM-YYYY')}</Text>
                </View>
                <View style={{ marginTop: 18 }}>
                    <Text style={{ fontSize: 18, color: 'grey' }}>Remarks</Text>
                    <Text style={{ fontSize: 18, color: 'white' }}>{item.remark}</Text>
                </View>
            </View>
            {/* Card components */}
        </View>
    )
}
export default PhotoDetailScreen;