import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Button, StyleSheet, CheckBox, SafeAreaView, TouchableOpacity, Picker } from 'react-native';
import DefaultButton from '../../../components/DefaultButton';
import Timeline from 'react-native-timeline-flatlist';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
//import styles from './styles';
import * as data from '../../../dummy/data/leadsData';
import { Badge, Overlay } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import DefectRemarkItem from '../../../components/Project/DefectRemarkItem';
import { getSingleProjectDefect } from '../../../services/projectDefect';
import { FlatList } from 'react-native';
import { Image } from 'react-native';

const DefectViewScreen = ({ navigation }) => {
    const { defect, project } = navigation.state.params;
    const [defectData, setDefectData] = useState([]);
    const [beforeImages, setBeforeImages] = useState([]);
    const [afterImages, setAfterImages] = useState([]);
    useEffect(() => {
        navigation.setParams({
            defect_id: defect.id,
            defect : defect,
            project
        });

        getSingleProjectDefect(defect.id).then((data) => {
            setDefectData(data);
            console.log(data)
            const beforeImages = data.images?.filter(i =>
                i.type == "BEFORE"
            );
            setBeforeImages(beforeImages);

            const afterImages = data.images?.filter(i =>
                i.type == "AFTER"
            );
            setAfterImages(afterImages);
        });
    }, [defect.id]);

    useEffect(() => {
        navigation.addListener('willFocus', () => {
            getSingleProjectDefect(defect.id).then((data) => {
                
                setDefectData(data)
                const beforeImages = data.images?.filter(i =>
                    i.type == "BEFORE"
                );

                setBeforeImages(beforeImages);

                const afterImages = data.images?.filter(i =>
                    i.type == "AFTER"
                );
                setAfterImages(afterImages);
            });
        });
    }, [navigation]);

    return (
        <View style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'stretch',
            //padding: 20,
            backgroundColor: '#F3F3F3',
        }}>
            {/* HEADER SECTIOM */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
                <View style={{ justifyContent: 'center', width: '50%' }}>
                    <Text style={styles.title}>Project Defects: {defectData.scope_of_work?.name}</Text>
                </View>
                <View style={{ width: '50%', justifyContent: 'center', alignItems: 'flex-end' }}>
                    <Badge
                        status={(defectData.status == "Active") ? "warning" : (defectData.status == "Inactive" && defectData.complete_date == null) ? "error" : "success"}
                        containerStyle={{ padding: 5 }}
                        value={<Text style={{ color: 'white', margin: 15, fontSize: 12 }}>{(defectData.status == "Active") ? "Active" : (defectData.status == "Inactive" && defectData.complete_date == null) ? "Inactive" : "Closed"}</Text>}
                    />
                </View>
            </View>
            <ScrollView showsHorizontalScrollIndicator={false}>

                {/* SECTION 1 */}
                <View style={{ flexDirection: 'row', padding: 20 }}>
                    <View style={{ alignItems: 'flex-start', width: '33.3%' }}>
                        <Text style={styles.label}>Area</Text>
                    </View>
                    <View style={{ alignItems: 'flex-start', width: '33.3%' }}>
                        <Text style={styles.label}>Category</Text>
                    </View>
                    <View style={{ alignItems: 'flex-start', width: '33.3%' }}>
                        <Text style={styles.label}>Sow</Text>
                    </View>
                </View>

                {/* SECTION 2 */}
                <View style={{ flexDirection: 'row', paddingHorizontal: 20 }}>
                    <View style={{ alignItems: 'flex-start', width: '33.3%' }}>
                        <Text style={styles.text}>{defectData.area ? defectData.area.name : defectData.area_name}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-start', width: '33.3%' }}>
                        <Text style={styles.text}>{defectData.category}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-start', width: '33.3%' }}>
                        <Text style={styles.text}>{defectData.scope_of_work?.name}</Text>
                    </View>
                </View>

                {/* SECTION 3 */}
                <View style={{ flexDirection: 'row', padding: 20 }}>
                    <View style={{ alignItems: 'flex-start', width: '50%' }}>
                        <Text style={styles.label}>Completion Date</Text>
                    </View>
                    <View style={{ alignItems: 'flex-start', width: '50%' }}>
                        <Text style={styles.label}>Action by</Text>
                    </View>
                </View>

                {/* SECTION 4 */}
                <View style={{ flexDirection: 'row', paddingHorizontal: 20 }}>
                    <View style={{ alignItems: 'flex-start', width: '50%' }}>
                        <Text style={styles.text}>{defectData.complete_date ? moment(defectData.complete_date).format('DD-MM-YYYY') : "Incomplete"}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-start', width: '50%' }}>
                            {
                                defectData?.vendors?.map((item,index) => {
                                    return (<Text style={{color: item.is_new ? "red" : "black"}}>{item.vendor ? item.vendor.name : item.vendor_name}</Text>)
                                })
                            }
                        
                    </View>
                </View>

                {/* PHOTO SECTION */}
                <View style={{ padding: 20, marginTop: 20, backgroundColor: 'white' }}>
                    <View style={{ flexDirection: 'row', }}>
                        <View style={{ alignItems: 'flex-start', width: '50%' }}>
                            <Text style={{ fontSize: 18, color: 'black' }}>Before Gallery</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 10, backgroundColor: 'white', height: 130, padding: 10, flexDirection: 'row' }}>
                        <FlatList
                            horizontal
                            showsHorizontalScrollIndicator
                            data={beforeImages}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <View style={{ width: 140, height: 130, marginHorizontal: 2 }}>
                                    <Image source={{ uri: item.path }} style={{ width: '100%', height: 140, borderRadius: 10, resizeMode: 'stretch' }} />
                                </View>

                            )}
                        />
                    </View>
                </View>

                {/* PHOTO SECTION */}
                <View style={{ padding: 20, marginTop: 20, backgroundColor: 'white' }}>
                    <View style={{ flexDirection: 'row', }}>
                        <View style={{ alignItems: 'flex-start', width: '50%' }}>
                            <Text style={{ fontSize: 18, color: 'black' }}>After Gallery</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 10, backgroundColor: 'white', height: 130, padding: 10, flexDirection: 'row' }}>
                        <FlatList
                            horizontal
                            showsHorizontalScrollIndicator
                            data={afterImages}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <View style={{ width: 140, height: 130, marginHorizontal: 2 }}>
                                    <Image source={{ uri: item.path }} style={{ width: '100%', height: 140, borderRadius: 10, resizeMode: 'stretch' }} />
                                </View>

                            )}
                        />

                    </View>
                </View>

                {/* REMARK SECTION */}
                <View style={{ padding: 20 }}>
                    <Text style={styles.label}>Remarks</Text>
                </View>
                <View style={{ paddingHorizontal: 5, marginBottom:20 }}>
                    <FlatList
                        data={defectData.remarks}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <DefectRemarkItem item={item} designer={defectData.designer?.name || '-'} onViewPress={() => console.log('PRESSED')} />
                        )}
                    />
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 65,
        backgroundColor: 'white'
    },
    list: {
        flex: 1,
        marginTop: 20,
        marginLeft: 20
    },
    title: {
        fontSize: 20,
        color: 'grey'
    },
    text: {
        fontSize: 14,
        color: 'black',
        fontWeight: '400'
    },
    descriptionContainer: {
        flexDirection: 'row',
        paddingRight: 50
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    textDescription: {
        marginLeft: 10,
        color: 'gray'
    },
    label: {
        fontSize: 14,
        color: 'grey',
    },
    row: {
        flexDirection: 'row',
        marginTop: 15,
    }
});
export default DefectViewScreen;