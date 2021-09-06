import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, FlatList } from 'react-native';
import styles from '../styles';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/FontAwesome'
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons'
import ProjectProgressItem from '../../../components/Project/ProjectProgressItem';
const ProjectProgressScreen = ({ navigation }) => {
    const categories = [
        { id: '1', name: 'Kitchen' },
        { id: '2', name: 'Living Room' },
    ];

    return (
        <View style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'stretch',
            //padding: 20,
            backgroundColor: '#F3F3F3',
        }}>
            <View style={{ padding: 20 }}>
                <View>
                    <Text style={{ fontSize: 20, color: 'grey' }}>Project Progress:</Text>
                    <Text style={{ fontSize: 20, color: 'grey' }}>Sam Ong</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '50%', padding: 15 }}>
                        <Text style={{ fontSize: 14, color: 'grey', marginBottom: 20 }}>Project ID</Text>
                        <Text style={{ fontSize: 14 }}>(Project ID)</Text>
                    </View>
                    <View style={{ width: '50%', padding: 15 }}>
                        <Text style={{ fontSize: 14, color: 'grey', marginBottom: 20 }}>Project created on</Text>
                        <Text style={{ fontSize: 14 }}>15/2/21</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 20, color: 'grey' }}>Area Categories</Text>
                </View>

            </View>
            <View>
                <FlatList
                    keyExtractor={item => item.id.toString()}
                    data={categories}
                    renderItem={({ item }) => {
                        return (
                            <ProjectProgressItem category={item.name} onViewPress={() => navigation.push('ProjectProgressPhoto', {
                                categoryName: item.name,
                            })} />
                        )
                    }}
                />
            </View>
            <View>
                <TouchableOpacity onPress={() => console.log('pressed')}>
                    <View style={{ backgroundColor: 'white', height: 55, padding: 20, justifyContent: 'center', flexDirection: 'row' }}>
                        <View style={{ width: '50%' }}>
                            <Text style={{ color: 'grey', fontSize: 14 }}>Add new area</Text>
                        </View>

                        <View style={{ width: '50%', alignItems: 'flex-end' }}>
                            <Icon name="plus" color='grey' size={20} />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}
export default ProjectProgressScreen;