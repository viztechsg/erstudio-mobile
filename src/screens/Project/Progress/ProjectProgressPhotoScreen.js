import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, FlatList, Image } from 'react-native';
import styles from '../styles';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/FontAwesome'
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons'
const ProjectProgressPhotoScreen = ({ navigation }) => {
    const { categoryName } = navigation.state.params;
    const photos = [
        {
            section: 'Basin',
            date: '15/20/2021',
            photos: [
                { uri: 'https://i.picsum.photos/id/804/200/200.jpg?hmac=73qw3Bnt67aOsdWd033BvfX9Gq0gIJ6FSL3Dp3gA97E', desc: 'Lorem ipsum' },
                { uri: 'https://i.picsum.photos/id/804/200/200.jpg?hmac=73qw3Bnt67aOsdWd033BvfX9Gq0gIJ6FSL3Dp3gA97E', desc: 'Lorem ipsum' },
                { uri: 'https://i.picsum.photos/id/804/200/200.jpg?hmac=73qw3Bnt67aOsdWd033BvfX9Gq0gIJ6FSL3Dp3gA97E', desc: 'Lorem ipsum' },
                { uri: 'https://i.picsum.photos/id/804/200/200.jpg?hmac=73qw3Bnt67aOsdWd033BvfX9Gq0gIJ6FSL3Dp3gA97E', desc: 'Lorem ipsum' },
                { uri: 'https://i.picsum.photos/id/804/200/200.jpg?hmac=73qw3Bnt67aOsdWd033BvfX9Gq0gIJ6FSL3Dp3gA97E', desc: 'Lorem ipsum' },
            ]
        },
        {
            section: 'Basin & Table',
            date: '19/20/2021',
            photos: [
                { uri: 'https://i.picsum.photos/id/804/200/200.jpg?hmac=73qw3Bnt67aOsdWd033BvfX9Gq0gIJ6FSL3Dp3gA97E', desc: 'Lorem ipsum' },
                { uri: 'https://i.picsum.photos/id/804/200/200.jpg?hmac=73qw3Bnt67aOsdWd033BvfX9Gq0gIJ6FSL3Dp3gA97E', desc: 'Lorem ipsum' },
                { uri: 'https://picsum.photos/id/237/200/300', desc: 'Lorem ipsum' },
            ]
        }
    ];
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
                    <Text style={{ fontSize: 20, color: 'white' }}>{categoryName} Progress</Text>
                </View>
                <View style={{ marginTop: 20 }}>
                    <FlatList
                        data={photos}
                        renderItem={({ item }) => (
                            <View style={{ marginBottom: 20 }}>
                                <Text style={{ color: 'white', fontSize:16 }}>{item.date} {item.section}</Text>
                                <FlatList
                                    data={item.photos}
                                    renderItem={({ item }) => (
                                        <View
                                            style={{
                                                flex: 1,
                                                flexDirection: 'column',
                                                margin: 1
                                            }}>
                                            <TouchableOpacity onPress={() => navigation.push('ProgressSinglePhoto',item)}>
                                                <Image
                                                    style={{
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        height: 120,
                                                    }}
                                                    source={{ uri: item.uri }}
                                                    resizeMode='stretch'
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    //Setting the number of column
                                    numColumns={3}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </View>

                        )}
                    />

                </View>
            </View>
            {/* Card components */}
        </View>
    )
}
export default ProjectProgressPhotoScreen;