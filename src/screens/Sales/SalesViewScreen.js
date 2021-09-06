import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Button, StyleSheet, CheckBox, SafeAreaView, TouchableOpacity, Picker } from 'react-native';
import TextField from '../../components/TextField';
import SelectPicker from '../../components/SelectPicker';
import LongText from '../../components/LongText';
import DefaultButton from '../../components/DefaultButton';
import Timeline from 'react-native-timeline-flatlist';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
//import styles from './styles';
import * as data from '../../dummy/data/leadsData';
import { Badge, Overlay } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import Accordion from 'react-native-collapsible/Accordion';
import QuoAgree from '../../components/Sales/QuoAgree';
import Icon2 from 'react-native-vector-icons/SimpleLineIcons';
import { getSingleProject } from '../../services/sales';


const SalesViewScreen = ({ navigation }) => {
    const { item } = navigation.state.params;

    const [visible, setVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState("java");
    const [defaultLabel, setDefaultLabel] = useState("Start Date");

    const [projectData, setProjectData] = useState([]);

    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [activeSections, setActiveSections] = useState([]);
    const SECTIONS = [
        {
            title: 'Quotation/Agreement',
            content: (
                <View>
                    {
                        item.lead.quotations.map((item,index) => {
                            return <QuoAgree item={item} key={++index} onViewPress={() => navigation.navigate('SalesViewDocument')} />
                        })
                    }
                </View>
            ),
        },
        {
            title: 'Variation Order',
            content: 'Lorem ipsum...',
        },
        {
            title: 'Completion Certificate',
            content: 'Lorem ipsum...',
        },
        {
            title: 'Handover Checklist',
            content: 'Lorem ipsum...',
        },
        {
            title: 'Customer Invoice',
            content: 'Lorem ipsum...',
        },
        {
            title: 'Supplier PO',
            content: 'Lorem ipsum...',
        },
        {
            title: 'Supplier Invoice',
            content: 'Lorem ipsum...',
        },
    ];

    const _renderHeader = section => {
        return (
            <View style={{ flexDirection: 'row', backgroundColor: 'white', height: 50, paddingHorizontal: 10, }}>
                <View style={{ justifyContent: 'center', width: '48%' }}>
                    <Text style={styles.headerText}>{section.title}</Text>
                </View>
                <View style={{ height: 50, justifyContent: 'center', width: '48%', alignItems: 'flex-end' }}>
                    <Icon name="down" size={20} color="black" />
                </View>
            </View>

        );
    };

    useEffect(() => {
        getSingleProject(item.id).then((data) => setProjectData(data));
    }, [item.id])

    const _renderContent = section => {
        return (
            <View style={{ backgroundColor: 'white', padding: 10 }}>
                <Text>{section.content}</Text>
            </View>
        );
    };

    const _updateSections = sections => {
        setActiveSections(sections.includes(undefined) ? [] : sections);
    };


    const toggleOverlay = () => {
        setVisible(!visible);
    };

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        setDefaultLabel(currentDate);
    };

    console.log(item)

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };
    return (
        <View style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'stretch',
            //padding: 20,
            backgroundColor: '#F3F3F3',
        }}>
            <Overlay isVisible={visible} onBackdropPress={toggleOverlay} overlayStyle={{ width: '80%' }}>
                <View>
                    <Text style={{ fontSize: 20, color: 'grey' }}>Appointment Details</Text>
                    <View
                        style={{
                            marginTop: 10,
                        }}
                    >
                        <Text style={{ fontSize: 14, color: 'grey' }}>Date</Text>
                        <TouchableOpacity onPress={showDatepicker}>
                            <Picker
                                style={{
                                    height: 50,
                                }}
                            >
                                <Picker.Item label={"Select date"} value="null" />
                            </Picker>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            marginTop: 10,
                        }}
                    >
                        <Text style={{ fontSize: 14, color: 'grey' }}>Time</Text>
                        <Picker
                            selectedValue="Select"
                            style={{
                                height: 50,
                            }}
                        >
                            <Picker.Item label="Select" value="Select" />
                        </Picker>
                    </View>
                    <View
                        style={{
                            marginTop: 10,
                        }}
                    >
                        <Text style={{ fontSize: 14, color: 'grey' }}>Venue</Text>
                        <TextInput style={{ borderColor: '#f3f3f3', height: 40, borderRadius: 5, borderWidth: 1, padding: 5 }} />
                    </View>
                    <View
                        style={{
                            marginTop: 10,
                        }}
                    >
                        <Text style={{ fontSize: 14, color: 'grey' }}>Client Name</Text>
                        <TextInput style={{ borderColor: '#f3f3f3', height: 40, borderRadius: 5, borderWidth: 1, padding: 5 }} />
                    </View>
                    <View
                        style={{
                            marginTop: 10,
                        }}
                    >
                        <Text style={{ fontSize: 14, color: 'grey' }}>Sales Name</Text>
                        <TextInput style={{ borderColor: '#f3f3f3', height: 40, borderRadius: 5, borderWidth: 1, padding: 5 }} />
                    </View>
                    <View
                        style={{
                            marginTop: 10,
                        }}
                    >
                        <Text style={{ fontSize: 14, color: 'grey' }}>Leads ID</Text>
                        <TextInput style={{ borderColor: '#f3f3f3', height: 40, borderRadius: 5, borderWidth: 1, padding: 5 }} />
                    </View>
                    <View
                        style={{
                            marginTop: 10,
                        }}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: '20%' }}>
                                <CheckBox />
                            </View>
                            <View style={{ width: '80%', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 12, color: 'grey' }}>Create an event on Google Calendar</Text>
                            </View>
                        </View>
                    </View>
                    <View
                        style={{
                            marginTop: 10,
                        }}
                    >
                        <DefaultButton onPress={() => console.log('Button pressed')} textButton="SAVE DETAILS" />
                    </View>
                </View>
            </Overlay>
            <View style={{ flexDirection: 'row', padding: 20 }}>
                <View style={{ width: '50%' }}>
                    <Text style={{ fontSize: 20 }}>Project: {item.client_name}</Text>
                </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ padding: 20, paddingTop: 0 }}>
                    <View style={styles.row}>
                        <View style={{ width: '50%' }}>
                            <Text style={styles.label}>Project ID</Text>
                            <Text style={{ fontSize: 14 }}>{projectData.project_no}</Text>
                        </View>
                        <View style={{ width: '50%' }}>
                            <Text style={styles.label}>Project created on</Text>
                            <Text style={{ fontSize: 14 }}>{moment(projectData.created_at).format("YYYY/MM/DD")}</Text>
                        </View>

                    </View>
                    <View style={styles.row}>
                        <View style={{ width: '50%' }}>
                            <Text style={styles.label}>Source</Text>
                            <Text style={{ fontSize: 14 }}>{item.source}</Text>
                        </View>
                        <View style={{ width: '50%', justifyContent: 'center', alignItems: 'flex-start' }}>
                            <Text style={styles.label}>Assigned To</Text>
                            <Text style={{ fontSize: 14 }}>Gilbert Teo</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={{ width: '50%', justifyContent: 'center', alignItems: 'flex-start' }}>
                            <Text style={styles.label}>Client Name</Text>
                            <Text style={{ fontSize: 14 }}>{item.client_name}</Text>
                        </View>
                        <View style={{ width: '50%', justifyContent: 'center', alignItems: 'flex-start' }}>
                            <Text style={styles.label}>IC Number</Text>
                            <Text style={{ fontSize: 14 }}>{projectData.ic_number}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={{ width: '50%', justifyContent: 'center', alignItems: 'flex-start' }}>
                            <Text style={styles.label}>Contact Number</Text>
                            <Text style={{ fontSize: 14 }}>{projectData.contact_number}</Text>
                        </View>
                        <View style={{ width: '50%', justifyContent: 'center', alignItems: 'flex-start' }}>
                            <Text style={styles.label}>Email</Text>
                            <Text style={{ fontSize: 14 }}>{item.email}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={{ width: '50%' }}>
                            <Text style={styles.label}>Property Type</Text>
                            <Text style={{ fontSize: 14 }}>HDB</Text>
                        </View>
                        <View style={{ width: '50%', justifyContent: 'center', alignItems: 'flex-start' }}>
                            <Text style={styles.label}>Address</Text>
                            <Text style={{ fontSize: 14 }}>{item.postal_code ? item.postal_code : "-"}</Text>
                            <Text style={{ fontSize: 14 }}>{item.residence ? item.residence : "-"}</Text>
                            <Text style={{ fontSize: 14 }}>{item.road_name ? item.road_name : "-"}</Text>
                        </View>
                    </View>
                    {/* Appointment */}
                    <View style={{marginHorizontal:-10, marginBottom:5}}>
                        <View style={{ paddingHorizontal: 10,padding:20, marginTop: -15 }}>
                            <Text style={styles.label}>Work Schedule</Text>
                        </View>
                        <View style={{ backgroundColor: '#B9B9B9', alignItems: 'center', justifyContent: 'center', height: 30, marginTop: -10 }}>
                            <Text style={{ color: '#808080' }}>No work schedule made</Text>
                        </View>
                        <View style={{ backgroundColor: 'white', height: 45, marginTop: 5, paddingHorizontal: 10, flexDirection: 'row' }}>
                            <View style={{ width: '50%', justifyContent:'center' }}>
                                <Text style={{ color: 'black' }}>Work Schedule</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ marginHorizontal: -10 }}>
                        <Accordion
                            sections={SECTIONS}
                            activeSections={activeSections}
                            // renderSectionTitle={_renderSectionTitle}
                            renderHeader={_renderHeader}
                            renderContent={_renderContent}
                            onChange={_updateSections}
                        />
                    </View>

                </View>
                <View style={{
                    backgroundColor: 'white', padding: 30, margin: -20, marginTop: 5, marginBottom: 10
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: '50%' }}>
                            <Text style={{ marginTop: -20, marginLeft: 10 }}>Remark</Text>
                        </View>
                        <View style={{ width: '50%', alignItems: 'flex-end' }}>
                            <Text style={{ marginTop: -20, marginLeft: 10, fontSize: 13, }}>View Details <Icon2 name="arrow-right" size={13} /></Text>
                        </View>
                    </View>

                    <Timeline
                        style={styles.list}
                        data={data.leadRemakrs}
                        circleSize={10}
                        circleColor='grey'
                        lineColor='grey'
                        timeContainerStyle={{ minWidth: 93 }}
                        timeStyle={{ textAlign: 'center', color: 'grey', marginTop: -5, marginBottom: 10 }}
                        titleStyle={{ textAlign: 'left', color: 'grey', marginTop: -15, fontWeight: '100', fontSize: 14, marginBottom: 10 }}
                        innerCircle={'dot'}
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
        fontSize: 16,
        fontWeight: 'bold'
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
export default SalesViewScreen;