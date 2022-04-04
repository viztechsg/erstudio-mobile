import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Button, StyleSheet, CheckBox, SafeAreaView, TouchableOpacity, Picker, FlatList } from 'react-native';
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
import WorkSchedule from '../../components/Sales/WorkSchedule';
import SupplierInvoice from '../../components/Sales/SupplierInvoice';
import { DOC_PREFIX_URL } from '../../constants/URL';
import Agreement from '../../components/Sales/Agreement';
import VariationOrder from '../../components/Sales/VariationOrder';
import GeneralDocument from '../../components/Sales/GeneralDocument';
import * as WebBrowser from 'expo-web-browser';
import Invoice from '../../components/Sales/Invoice';
import Handover from '../../components/Sales/Handover';
const SalesViewScreen = ({ navigation }) => {
    const { item } = navigation.state.params;

    const [visible, setVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState("java");
    const [defaultLabel, setDefaultLabel] = useState("Start Date");
    const [remarks, setRemarks] = useState([]);
    const [projectData, setProjectData] = useState([]);

    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [activeSections, setActiveSections] = useState([]);

    const viewGeneralDoc = async (url) => {
        await WebBrowser.openBrowserAsync(url);
    }

    const SECTIONS = [
        {
            title: 'Project Document',
            content: (
                <View>
                    {/* QUO/AGREE */}
                    {
                        projectData &&
                        projectData?.quotations?.map((item, index) => {
                            if (item.status != "draft") {
                                return (
                                    <View>
                                        <QuoAgree
                                            item={item}
                                            key={++index}
                                            onViewPress={() => navigation.navigate('SalesViewDocument',
                                                { item: item, type: 'Quotation', uri: "need-fetch", project_data: projectData }
                                            )}
                                        />
                                        {
                                            (item.agreement && item.agreement.status != "draft") &&
                                            (<Agreement
                                                item={item.agreement}
                                                key={++i}
                                                onViewPress={() => navigation.navigate('SalesViewAgreementDocument',
                                                    { item: item.agreement, type: 'Agreement', uri: "need-fetch", project_data: projectData }
                                                )}
                                            />)
                                        }
                                    </View>
                                )
                            }
                        })
                    }
                    {/* QUO/AGREE UPLOADED */}
                    {projectData &&
                        projectData?.documents?.map((item, index) => {
                            if (item.category == "Quotation" || item.category == "Agreement") {
                                return (
                                    <View>
                                        <GeneralDocument
                                            item={item}
                                            key={++index}
                                            onViewPress={() => viewGeneralDoc(item.attachment_path)}
                                        />
                                    </View>
                                )
                            }
                        })
                    }
                    {/* VO */}
                    {
                        projectData &&
                        projectData?.variation_orders?.map((item, index) => {
                            return (
                                <View>
                                    <VariationOrder
                                        item={item}
                                        key={++index}
                                        onViewPress={() => navigation.navigate('SalesViewVO',
                                            { item: item, type: 'VO', uri: "need-fetch", project_data: projectData }
                                        )}
                                    />
                                </View>
                            )
                        })
                    }
                    {projectData &&
                        projectData?.documents?.map((item, index) => {
                            if (item.category == "Variation Order") {
                                return (
                                    <View>
                                        <GeneralDocument
                                            item={item}
                                            key={++index}
                                            onViewPress={() => viewGeneralDoc(item.attachment_path)}
                                        />
                                    </View>
                                )
                            }
                        })
                    }
                    {projectData &&
                        projectData?.handover && (
                            <Handover
                                item={projectData?.handover}
                                runningNo={projectData?.project_no}
                                key={'HANDOVER_' + projectData?.handover.id}
                                onViewPress={() => navigation.navigate('SalesViewHandover',
                                    { item: projectData?.handover, type: 'HANDOVER', uri: "need-fetch", project_data: projectData }
                                )}
                            />
                        )
                    }
                    {projectData &&
                        projectData?.invoice && (
                            <Invoice
                                item={projectData?.invoice}
                                key={'CI_' + projectData?.invoice.id}
                                onViewPress={() => navigation.navigate('SalesViewInvoice',
                                    { item: projectData?.invoice, type: 'CI', uri: "need-fetch", project_data: projectData }
                                )}
                            />
                        )
                    }
                </View>
            ),
        },
        {
            title: 'Correspondence',
            content: (
                <View>
                    {projectData &&
                        projectData?.documents?.map((item, index) => {
                            if (item.category == "Supplier PO") {
                                return <GeneralDocument
                                    item={item}
                                    key={++index}
                                    onViewPress={() => viewGeneralDoc(item.attachment_path)}
                                />
                            }
                        })
                    }
                    {/* Certificate of Completion */}
                    {projectData &&
                        projectData?.documents?.map((item, index) => {
                            if (item.category == "Completion Certificate") {
                                return (
                                    <View>
                                        <GeneralDocument
                                            item={item}
                                            key={++index}
                                            onViewPress={() => viewGeneralDoc(item.attachment_path)}
                                        />
                                    </View>
                                )
                            }
                        })
                    }
                    {/* HANDOVER */}
                    {projectData &&
                        projectData?.documents?.map((item, index) => {
                            if (item.category == "Handover Checklist") {
                                return <GeneralDocument
                                    item={item}
                                    key={++index}
                                    onViewPress={() => viewGeneralDoc(item.attachment_path)}
                                />
                            }
                        })
                    }
                    {/* Customer Invoice */}
                    {projectData &&
                        projectData?.documents?.map((item, index) => {
                            if (item.category == "Customer Invoice") {
                                return <GeneralDocument
                                    item={item}
                                    key={++index}
                                    onViewPress={() => viewGeneralDoc(item.attachment_path)}
                                />
                            }
                        })
                    }

                    {projectData &&
                        projectData?.documents?.map((item, index) => {
                            if (item.category == "Others") {
                                return (
                                    <View>
                                        <GeneralDocument
                                            item={item}
                                            key={++index}
                                            onViewPress={() => viewGeneralDoc(item.attachment_path)}
                                        />
                                    </View>
                                )
                            }
                        })
                    }
                </View>
            ),
        },
        {
            title: 'Supplier Invoice',
            content: (
                <View>
                    {projectData &&
                        projectData?.supplier_invoices?.map((item, index) => {
                            return <SupplierInvoice
                                item={item}
                                key={++index}
                                onViewPress={() => navigation.navigate('SalesViewSIDocument',
                                    { item: item, type: `Supplier Invoice : ${item.supplier?.vendor?.name}`, uri: item.attachment_path, project_data: projectData }
                                )}
                            />
                        })
                    }

                    {projectData &&
                        projectData?.documents?.map((item, index) => {
                            if (item.category == "Supplier Invoice") {
                                return (
                                    <View>
                                        <GeneralDocument
                                            item={item}
                                            key={++index}
                                            onViewPress={() => viewGeneralDoc(item.attachment_path)}
                                        />
                                    </View>
                                )
                            }
                        })
                    }
                </View>
            ),
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

    const initData = () => {
        getSingleProject(item.id).then((data) => {
            console.log(data.quotations);
            setProjectData(data)
            setRemarks([]);
            rebuildRemarkObject(data.remarks);
        });
    }

    useEffect(() => {
        initData();
        navigation.setParams({
            item: item,
        });
    }, [item.id])

    useEffect(() => {
        navigation.addListener('willFocus', () => {
            initData();
            navigation.setParams({
                item: item,
            });
        });
    }, [navigation, item.id]);

    const _renderContent = section => {
        return (
            <View style={{ backgroundColor: 'white', padding: 10, width: '100%' }}>
                <View>{section.content}</View>
            </View>
        );
    };

    const _updateSections = sections => {
        setActiveSections(sections.includes(undefined) ? [] : sections);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const rebuildRemarkObject = (data) => {
        data.map((value) => {
            setRemarks((oldValue) => [
                ...oldValue,
                {
                    time: moment(value.created_at).format('DD/MM/YYYY'),
                    title: value.remark,
                },
            ]);
        });
    };

    const renderWS = ({ item, index }) => (
        <WorkSchedule key={index + 1} item={item} no={index + 1} onViewPress={() => console.log(index + 1)} />
    )


    return (
        <View style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'stretch',
            //padding: 20,
            backgroundColor: '#F3F3F3',
        }}>
            <View style={{ flexDirection: 'row', padding: 20 }}>
                <View style={{ width: '50%' }}>
                    <Text style={{ fontSize: 20 }}>Project: {projectData?.client_name}</Text>
                </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ padding: 20, paddingTop: 0 }}>
                    <View style={styles.row}>
                        <View style={{ width: '50%' }}>
                            <Text style={styles.label}>Project ID</Text>
                            <Text style={{ fontSize: 14 }}>{projectData?.project_no}</Text>
                        </View>
                        <View style={{ width: '50%' }}>
                            <Text style={styles.label}>Project created on</Text>
                            <Text style={{ fontSize: 14 }}>{moment(projectData?.created_at).format("YYYY/MM/DD")}</Text>
                        </View>

                    </View>
                    <View style={styles.row}>
                        <View style={{ width: '50%' }}>
                            <Text style={styles.label}>Source</Text>
                            <Text style={{ fontSize: 14 }}>{item.lead.runner_no}</Text>
                        </View>
                        <View style={{ width: '50%', justifyContent: 'center', alignItems: 'flex-start' }}>
                            <Text style={styles.label}>Assigned To</Text>
                            <Text style={{ fontSize: 14 }}>{item.designer?.name}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={{ width: '50%', justifyContent: 'center', alignItems: 'flex-start' }}>
                            <Text style={styles.label}>Client Name</Text>
                            <Text style={{ fontSize: 14 }}>{projectData?.client_name}</Text>
                        </View>
                        <View style={{ width: '50%', justifyContent: 'center', alignItems: 'flex-start' }}>
                            <Text style={styles.label}>IC Number</Text>
                            <Text style={{ fontSize: 14 }}>{projectData?.ic_number}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={{ width: '50%', justifyContent: 'center', alignItems: 'flex-start' }}>
                            <Text style={styles.label}>Contact Number</Text>
                            <Text style={{ fontSize: 14 }}>{projectData?.contact_number}</Text>
                        </View>
                        <View style={{ width: '50%', justifyContent: 'center', alignItems: 'flex-start' }}>
                            <Text style={styles.label}>Email</Text>
                            <Text style={{ fontSize: 14 }}>{projectData?.email}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={{ width: '50%' }}>
                            <Text style={styles.label}>Property Type</Text>
                            <Text style={{ fontSize: 14 }}>{item.lead.property_type.name}</Text>
                        </View>
                        <View style={{ width: '50%', justifyContent: 'center', alignItems: 'flex-start' }}>
                            <Text style={styles.label}>Address</Text>
                            <Text style={{ fontSize: 14 }}>{projectData.postal_code ? projectData.postal_code : "-"}</Text>
                            <Text style={{ fontSize: 14 }}>{projectData.residence ? projectData.residence : "-"}</Text>
                            <Text style={{ fontSize: 14 }}>{projectData.road_name ? projectData.road_name : "-"}</Text>
                        </View>
                    </View>
                    {/* Appointment */}
                    <View style={{ marginHorizontal: -10, marginBottom: 5 }}>
                        <View style={{ paddingHorizontal: 10, padding: 20, marginTop: -15 }}>
                            <Text style={styles.label}>Work Schedule</Text>
                        </View>
                        {
                            (projectData.work_schedules && projectData.work_schedules.length < 1) &&
                            (
                                <View
                                    style={{
                                        backgroundColor: '#B9B9B9',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: 30,
                                        marginTop: -10,
                                    }}
                                >
                                    <Text style={{ color: '#808080' }}>No work schedules made</Text>
                                </View>
                            )
                        }
                        <View style={{ flexDirection: 'column' }}>
                            <FlatList
                                removeClippedSubviews={true}
                                keyExtractor={(item) => item.id.toString()}
                                data={projectData?.work_schedules}
                                renderItem={renderWS}
                                initialNumToRender={25}
                                updateCellsBatchingPeriod={50}
                            />
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
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '50%' }}>
                        <Text style={{ marginLeft: 20 }}>Remarks</Text>
                    </View>
                </View>
                {
                    remarks.length > 0 ?
                        (
                            <View
                                style={{
                                    backgroundColor: 'white',
                                    paddingHorizontal: 50,
                                    margin: -20,
                                    marginTop: 15,
                                    marginBottom: 1,
                                    paddingBottom: 5,
                                    paddingTop: 10,
                                }}>
                                <Timeline
                                    style={styles.list}
                                    data={remarks}
                                    circleSize={10}
                                    circleColor="grey"
                                    options={{
                                        removeClippedSubviews: true,
                                        initialNumToRender: 5,
                                        updateCellsBatchingPeriod: 10
                                    }}
                                    lineColor="grey"
                                    timeContainerStyle={{ minWidth: 93 }}
                                    listViewContainerStyle={{ paddingTop: 10 }}
                                    timeStyle={{
                                        textAlign: 'center',
                                        color: 'grey',
                                        marginTop: -5,
                                        marginBottom: 10,
                                    }}
                                    titleStyle={{
                                        textAlign: 'left',
                                        color: 'grey',
                                        marginTop: -15,
                                        fontWeight: '100',
                                        fontSize: 14,
                                        marginBottom: 10,
                                    }}
                                    innerCircle={'dot'}
                                />

                            </View>
                        ) :
                        (
                            <View
                                style={{
                                    backgroundColor: '#B9B9B9',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: 30,
                                }}>
                                <Text style={{ color: '#808080' }}>No remark yet</Text>
                            </View>
                        )
                }
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