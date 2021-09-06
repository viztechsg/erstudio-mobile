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

const DefectViewScreen = ({ navigation }) => {
    return (
        <View style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'stretch',
            //padding: 20,
            backgroundColor: '#F3F3F3',
        }}>
            {/* HEADER SECTIOM */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', padding: 20 }}>
                <View style={{ justifyContent: 'center' }}>
                    <Text style={styles.title}>Project Defects:</Text>
                </View>
                <View style={{ width: '50%', justifyContent: 'center', alignItems: 'flex-end' }}>
                    <Badge
                        status="warning"
                        containerStyle={{ padding: 5 }}
                        value={<Text style={{ color: 'white', margin: 15, fontSize: 12 }}>Active</Text>}
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
                        <Text style={styles.text}>Master room</Text>
                    </View>
                    <View style={{ alignItems: 'flex-start', width: '33.3%' }}>
                        <Text style={styles.text}>Defect</Text>
                    </View>
                    <View style={{ alignItems: 'flex-start', width: '33.3%' }}>
                        <Text style={styles.text}>Flooring</Text>
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
                        <Text style={styles.text}>Incomplete</Text>
                    </View>
                    <View style={{ alignItems: 'flex-start', width: '50%' }}>
                        <Text style={styles.text}>SB Pte Ltd</Text>
                    </View>
                </View>

                {/* PHOTO SECTION */}
                <View style={{ padding: 20, marginTop: 20, backgroundColor: 'white' }}>
                    <View style={{ flexDirection: 'row', }}>
                        <View style={{ alignItems: 'flex-start', width: '50%' }}>
                            <Text style={{ fontSize: 18, color: 'black' }}>Before Gallery</Text>
                        </View>
                        <View style={{ alignItems: 'flex-start', width: '25%', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 12, color: 'grey' }}>0 of 0 shown</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end', width: '25%', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 12, color: 'grey', fontWeight: '400' }}>View all ></Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 10, backgroundColor: 'white', height: 130, padding: 10, flexDirection: 'row' }}>
                        <TouchableOpacity>
                            <View style={{ height: 120, width: 130, borderColor: 'grey', borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center' }}>
                                <Icon name="pluscircleo" size={60} color="grey" />
                            </View>
                        </TouchableOpacity>

                    </View>
                </View>

                {/* PHOTO SECTION */}
                <View style={{ padding: 20, marginTop: 20, backgroundColor: 'white' }}>
                    <View style={{ flexDirection: 'row', }}>
                        <View style={{ alignItems: 'flex-start', width: '50%' }}>
                            <Text style={{ fontSize: 18, color: 'black' }}>After Gallery</Text>
                        </View>
                        <View style={{ alignItems: 'flex-start', width: '25%', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 12, color: 'grey' }}>0 of 0 shown</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end', width: '25%', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 12, color: 'grey', fontWeight: '400' }}>View all ></Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 10, backgroundColor: 'white', height: 130, padding: 10, flexDirection: 'row' }}>
                        <TouchableOpacity>
                            <View style={{ height: 120, width: 130, borderColor: 'grey', borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center' }}>
                                <Icon name="pluscircleo" size={60} color="grey" />
                            </View>
                        </TouchableOpacity>

                    </View>
                </View>

                {/* REMARK SECTION */}
                <View style={{ padding: 20 }}>
                    <Text style={styles.label}>Remarks</Text>
                </View>
                <View style={{ paddingHorizontal: 5 }}>
                    <View>
                        <DefectRemarkItem onViewPress={() => console.log('PRESSED')} />
                        <DefectRemarkItem onViewPress={() => console.log('PRESSED')} />
                    </View>
                    <TouchableOpacity onPress={() => console.log('PRESSED')}>
                        <View style={{ backgroundColor: 'white', justifyContent: 'center', height: 45, marginTop: 5, paddingHorizontal: 20, flexDirection: 'row', marginBottom: 20 }}>
                            <View style={{ width: '50%', justifyContent: 'center' }}>
                                <Text style={{ color: 'black' }}>Add new remark</Text>
                            </View>

                            <View style={{ width: '50%', alignItems: 'flex-end', justifyContent: 'center' }}>
                                <Icon name="plus" size={30} color="black" />
                            </View>

                        </View>
                    </TouchableOpacity>
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
        fontSize: 24,
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