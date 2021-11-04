import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, FlatList } from 'react-native';
import styles from '../styles';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/FontAwesome'
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons'
import ProjectProgressItem from '../../../components/Project/ProjectProgressItem';
import moment from 'moment';
import { addProjectArea, getProjectArea } from '../../../services/project';
import { getAreaSource } from '../../../services/config';
import { Overlay } from 'react-native-elements';
import SelectPicker from '../../../components/SelectPicker';
import DefaultButton from '../../../components/DefaultButton';
import { SafeAreaView } from 'react-native';
import { RefreshControl } from 'react-native';
const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}
const ProjectProgressScreen = ({ navigation }) => {
    const [categories, setCategories] = useState([]);
    const [areaList, setAreaList] = useState([]);
    const [areaId, setAreaId] = useState("");
    const [visible, setVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const { item } = navigation.state.params;

    const toggleOverlay = () => {
        setVisible(!visible)
    }

    const initData = () => {
        getProjectArea(item.id).then((data) => {
            setCategories([]);
            data.map((value) => {
                setCategories((oldValue) => [
                    ...oldValue,
                    { id: value.area_id, project_id: value.project_id, name: value.area.name },
                ]);
            });
        }).then(console.log(categories));
    }

    useEffect(() => {
        initData();
        getAreaSource().then(data => {
            setAreaList([]);
            data.data.map((value) => {
                setAreaList((oldValue) => [
                    ...oldValue,
                    { key: value.id, value: value.id, label: value.name },
                ]);
            });
        });
    }, [item.id]);

    const addArea = () => {
        let payload = {
            project_id: item.id,
            area_id: areaId
        }
        addProjectArea(payload).then(data => {toggleOverlay(),onRefresh()});
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        initData()
        wait(3000).then(() => setRefreshing(false))
    }, [refreshing]);

    return (
        <View style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'stretch',
            //padding: 20,
            backgroundColor: '#F3F3F3',
        }}>
            <Overlay
                isVisible={visible}
                onBackdropPress={toggleOverlay}
                overlayStyle={{ width: '80%' }}
            >
                <SafeAreaView>
                    <Text style={{ fontSize: 20, color: 'grey' }}>Select Area</Text>
                    <SelectPicker
                        label="Area"
                        required={true}
                        selectedValue={areaId}
                        onSelect={area => setAreaId(area)}
                        options={areaList}
                    />

                    <DefaultButton textButton="SAVE DETAILS" onPress={() => addArea() } />
                </SafeAreaView>
            </Overlay>
            <View style={{ padding: 20 }}>
                <View>
                    <Text style={{ fontSize: 20, color: 'grey' }}>Project Progress:</Text>
                    <Text style={{ fontSize: 20, color: 'grey' }}>{item.client_name}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '50%', padding: 15 }}>
                        <Text style={{ fontSize: 14, color: 'grey', marginBottom: 20 }}>Project ID</Text>
                        <Text style={{ fontSize: 14 }}>{item.project_no}</Text>
                    </View>
                    <View style={{ width: '50%', padding: 15 }}>
                        <Text style={{ fontSize: 14, color: 'grey', marginBottom: 20 }}>Project created on</Text>
                        <Text style={{ fontSize: 14 }}>{moment(item.created_at).format('DD/MM/YYYY')}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 20, color: 'grey' }}>Area Categories</Text>
                </View>

            </View>
            <View>
                <FlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />}
                    keyExtractor={item => item.id.toString()}
                    data={categories}
                    renderItem={({ item }) => {
                        return (
                            <ProjectProgressItem category={item.name} onViewPress={() => navigation.push('ProjectProgressPhoto', {
                                categoryName:item.name, area_id: item.id, project_id: item.project_id
                            })} />
                        )
                    }}
                />
            </View>
            <View>
                <TouchableOpacity onPress={toggleOverlay}>
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