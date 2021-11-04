import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, FlatList, Image } from 'react-native';
import styles from '../styles';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/FontAwesome'
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons'
import { getProjectProgress } from '../../../services/project';
import moment from 'moment';
const ProjectProgressPhotoScreen = ({ navigation }) => {
    const { categoryName, area_id, project_id } = navigation.state.params;
    const [data, setData] = useState([]);

    useEffect(() => {
        navigation.setParams({
            categoryName,
            area_id,
            project_id
        });
        getProjectProgress(project_id, area_id).then(data => setData(data));
    }, [area_id, project_id]);

    useEffect(() => {
        navigation.addListener('willFocus', () => {
            navigation.setParams({
                categoryName,
                area_id,
                project_id
            });
            getProjectProgress(project_id, area_id).then(data => setData(data));
        });
    }, [navigation, area_id, project_id]);

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
                        data={data}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => {
                            var sow = item.scope_of_work.name;
                            return (
                                <View style={{ marginBottom: 20 }}>
                                    <Text style={{ color: 'white', fontSize: 16 }}>{moment(item.created_at).format('DD/MM/YYYY')} {item.scope_of_work.name}</Text>
                                    <FlatList
                                        data={item.photos}
                                        renderItem={({ item }) => {
                                            return (
                                                <View
                                                    style={{
                                                        flex: 1,
                                                        flexDirection: 'column',
                                                        margin: 1
                                                    }}>
                                                    <TouchableOpacity onPress={() => navigation.push('ProgressSinglePhoto', { item: item, categoryName, sow })}>
                                                        <Image
                                                            style={{
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                height: 120,
                                                            }}
                                                            source={{ uri: item.path }}
                                                            resizeMode='stretch'
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        }}
                                        //Setting the number of column
                                        numColumns={3}
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                </View>

                            )
                        }}
                    />

                </View>
            </View>
            {/* Card components */}
        </View>
    )
}
export default ProjectProgressPhotoScreen;