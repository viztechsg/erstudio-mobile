import React, { useState, useEffect } from 'react'
import TextField from '../../components/TextField'
import LongText from '../../components/LongText'
import DefaultButton from '../../components/DefaultButton'
import DatePicker from '../../components/DatePicker'
import styles from './styles'
import {
    View,
    Text,
    TextInput,
    ScrollView,
    Button,
    StyleSheet,
    SafeAreaView,
    Picker,
    TouchableOpacity,
    Alert,
    Dimensions
} from 'react-native'
import { Overlay } from 'react-native-elements'
import SelectPicker from '../../components/SelectPicker'
import DateTimePicker from '@react-native-community/datetimepicker'
import Timeline from 'react-native-timeline-flatlist'
import Icon from 'react-native-vector-icons/AntDesign'
//import styles from './styles';
import * as leadCollection from '../../dummy/data/leadsData'
import moment from 'moment'

//REDUX
import { getLeadData } from '../../actions/leadAction'
import { useDispatch } from 'react-redux'
import { store } from '../../store/store'
import { addLeadRemark, getPropertyType, getSourceLead } from '../../services/lead'
import { createSalesProject, getSalesData, updateSalesProject } from '../../actions/salesAction'
import { addProjectRemark, addProjectWorkSchedule, getSingleProject } from '../../services/sales'
import WorkSchedule from '../../components/Sales/WorkSchedule'
import { getRemarkSource, getSowSource, getVendorSource, getVendorSow } from '../../services/config'
import { RadioButton } from 'react-native-paper';
import { getProjectVendorList } from '../../services/projectDefect'
const SalesEditScreen = ({ props, navigation }) => {

    const { item } = navigation.state.params;

    const [data, setData] = useState([]);
    const [workSchedules, setWorkSchedules] = useState(item.work_schedules);
    const [leadID, setLeadID] = useState('')
    const [remarkData, setRemarkData] = useState(item.remarks);
    const [dataRemark, setDataRemark] = useState([]);
    const [sourceLeadOption, setSourceLeadOption] = useState([]);
    const [propertyTypeOption, setPropertyTypeOption] = useState([]);
    const [conditionTypeOption, setConditionTypeOption] = useState([]);
    const [salesmanOption, setSalesmanOption] = useState([]);

    const [visible, setVisible] = useState(false);

    //SCHEDULE MODAL
    const [defaultLabel, setDefaultLabel] = useState("");
    const [defaultLabel2, setDefaultLabel2] = useState("");
    const [dateType, setDateType] = useState(1);

    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    //WORK SCHEDULE
    const [start_date, setStartDate] = useState("");
    const [end_date, setEndDate] = useState("");
    const [venue, setVenue] = useState("");
    const [scope_of_work, setSOW] = useState("");
    const [vendor_id, setVendor] = useState("");
    const [other_sow, setOtherSOW] = useState("");
    const [sowId, setSowId] = useState("");

    const [sowOptions, setSowOptions] = useState([]);
    const [vendorOption, setVendorOption] = useState([]);

    // REMARK
    const [remarkId, setRemarkId] = useState(0);
    const [remarkCheckboxes, setRemarkCheckboxes] = useState([]);
    const [remarkModal, setRemarkModal] = useState(false);
    const [remarkCheck, setRemarkCheck] = useState('');

    const initVendor = () => {
        setVendor("");
        if (sowId != "") {
            getVendorSow(sowId).then((data) => {
                console.log(data)
                setVendorOption([]);
                data.map((value) => {
                    if(value.vendor_id != null)
                    {
                        setVendorOption((oldValue) => [
                            ...oldValue,
                            { label: value.vendor.name, value: value.vendor.id, key: value.vendor.name },
                        ]);
                    }
                });
            })
        }
        else{
            setVendorOption([]);
        }
    }

    useEffect(() => {
        getPropertyType().then((data) => {
            setPropertyTypeOption([]);
            data.map((value) => {
                setPropertyTypeOption((oldValue) => [
                    ...oldValue,
                    { label: value.name, value: value.id, key: value.name },
                ]);
            });
        });
        // getVendorSource().then((data) => {
        //     setVendorOption([]);
        //     data.data.map((value) => {
        //         setVendorOption((oldValue) => [
        //             ...oldValue,
        //             { label: value.name, value: value.id, key: value.name },
        //         ]);
        //     });
        // });

        initVendor();

        getSowSource().then((data) => {
            setSowOptions([]);
            data.data.map((value) => {
                setSowOptions((oldValue) => [
                    ...oldValue,
                    { label: value.name, value: value.id, key: value.name },
                ]);
            });
        });
    }, [item.id]);

    // REMARK
    useEffect(() => {
        getRemarkSource().then((data) => rebuildRemarkOption(data.data));
    }, [item.id]);

    const rebuildRemarkOption = (data) => {
        setRemarkCheckboxes([]);
        data.map((value) => {
            setRemarkCheckboxes((oldValue) => [
                ...oldValue,
                { id: value.id, value: value.name },
            ]);
        });
    };

    const remarkModalToggle = () => {
        setRemarkModal(!remarkModal);
    };

    const addRemark = () => {
        let remarkItem = {
            project_id: item.id,
            title: remarkCheck,
            time: moment('YYYY-MM-DD'),
        };

        setRemarkData([...remarkData, remarkItem]);
        addProjectRemark(remarkItem).
            then(
                remarkModalToggle()
            );
    };

    const toggleOverlay = () => {
        setVisible(!visible)
    }

    const rebuildRemarkObject = (data) => {
        data.map((value) => {
            setDataRemark((oldValue) => [
                ...oldValue,
                {
                    time: moment(value.created_at).format('DD/MM/YYYY'),
                    title: value.remark,
                },
            ]);
        });
    };

    const onSelectSourceLead = (data) => {
        setLeadID(data)
    }

    const onSelectPropertyType = (child) => {
        setData(prevState => ({ ...prevState, property_type_id: child }));
    }

    const rebuildSourceLeadData = (data) => {
        data.map((value) => {
            if (value.id == item.lead_id) {
                setSourceLead((oldValue) => [
                    ...oldValue,
                    { id: value.id, name: value.runner_no, },
                ])

                setLeadID(value.id);
            }
        })
    }

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        if (dateType == 1) {
            setDefaultLabel(currentDate);
        }
        else {
            setDefaultLabel2(currentDate);
        }

    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = (type) => {
        showMode('date');
        setDateType(type);
    }

    const dispatch = useDispatch()

    const onSubmitUpdate = () => {
        // const { leadID, clientName, email, phoneNumber, propertyType, postalCode, roadName, roadNo, residence, projectStart, blockNo, budget } = params;
        dispatch(
            updateSalesProject({
                clientName: data.client_name,
                email: data.email,
                phoneNumber: data.contact_number,
                propertyType: data.property_type_id,
                postalCode: data.postal_code,
                roadName: data.road_name,
                roadNo: data.road_no,
                residence: data.residence,
                projectStart: data.project_start,
                blockNo: data.block_no,
            },
                item.id
            ),
        )
    }

    const addWorkSchedule = () => {
        let finalSOW = scope_of_work;

        if (scope_of_work == 'Other') {
            if (other_sow == '') {
                Alert.alert("Warning", "Please fill Scope Of Work");
                return;
            }
            else {
                finalSOW = other_sow;
            }
        }

        let workSchedule = {
            project_id: item.id,
            vendor_id,
            venue,
            sow_id: sowId,
            scope_of_work: finalSOW,
            start_date,
            end_date
        }

        addProjectWorkSchedule(workSchedule)
            .then(setWorkSchedules([...workSchedules, workSchedule]))
            .then(toggleOverlay())
            .then(setSowId(""));
    }

    useEffect(() => {
        initVendor();
    }, [sowId, item.id]);

    useEffect(() => {
        let fetched = false;
        getSingleProject(item.id).then((data) => {
            setData(data)
            setDataRemark([]);
            rebuildRemarkObject(data.remarks);

            // Defatul work schedule venue
            if(data.residence != null && data.block_no != null && data.road_name != null)
            {
                setVenue(data.residence+' '+data.block_no+', '+data.road_name);
            }
            
        });
        return () => {
            fetched = true;
        }
    }, [item.id, workSchedules, remarkData]);



    return (
        <View
            style={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'stretch',
                backgroundColor: '#F3F3F3',
            }}
        >
            {/* REMARK WORK SCHEDULE */}
            <Overlay
                isVisible={visible}
                onBackdropPress={toggleOverlay}
                overlayStyle={{ width: '80%' }}
            >
                <ScrollView style={{paddingBottom:20}}>
                    <Text style={{ fontSize: 20, color: 'grey' }}>Schedule Details</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <View style={{ width: '49%' }}>
                            <DatePicker required={true} label="Start Date" initialDate={start_date || null} key='DATE_START_1' onChange={startDate => setStartDate(startDate)} />
                        </View>
                        <View style={{ width: '49%' }}>
                            <DatePicker required={true} label="End Date" initialDate={end_date || null} key='DATE_END_1' onChange={endDate => setEndDate(endDate)} />
                        </View>
                    </View>

                    <TextField placeholder="Venue" required={true} editable={true} label="Venue" value={venue} onChange={venue => setVenue(venue)} />

                    <SelectPicker
                        label="Scope of Work"
                        required={true}
                        selectedValue={scope_of_work}
                        onSelect={(sow,index) => {setSOW(sowOptions[index-1].label); setSowId(sow);}}
                        options={sowOptions}
                    />

                    <SelectPicker
                        label="Vendor"
                        required={true}
                        selectedValue={vendor_id}
                        onSelect={vendorId => setVendor(vendorId)}
                        options={vendorOption}
                    />

                    <LongText
                        key='SOW_OTHER'
                        onChange={otherSOW => setOtherSOW(otherSOW)}
                    />

                    <DefaultButton textButton="SAVE DETAILS" onPress={addWorkSchedule} />
                </ScrollView>
            </Overlay>

            {/* REMARK MODAL */}
            <Overlay
                isVisible={remarkModal}
                onBackdropPress={remarkModalToggle}
                overlayStyle={{ width: '80%', height: Dimensions.height, marginBottom: Platform.OS == 'ios' ? 250 : 0 }}
            >
                <View>
                    <Text
                        style={[
                            styles.title,
                            { color: 'grey', fontWeight: '800', fontSize: 18 },
                        ]}>
                        Please choose remark
                    </Text>
                    {remarkCheckboxes &&
                        remarkCheckboxes?.length > 0 &&
                        remarkCheckboxes.map((item, index) => {
                            return (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <RadioButton.Android
                                        value={item.value}
                                        status={remarkCheck == item.value ? 'checked' : 'unchecked'}
                                        onPress={() => {
                                            setRemarkCheck(item.value);
                                            setRemarkId(item.id);
                                        }}
                                    />
                                    <Text style={{ fontSize: 14 }}>{item.value}</Text>
                                </View>
                            );
                        })}
                    <LongText
                        value={remarkCheck}
                        onChange={(remark) => {
                            setRemarkCheck(remark);
                            setRemarkId(0);
                        }}
                    />
                    <DefaultButton onPress={addRemark} textButton="SAVE CHANGES" />
                </View>
            </Overlay>

            <View style={{ padding: 20 }}>
                <Text style={{ fontSize: 20 }}>Edit Project</Text>
                <Text style={{ fontSize: 14, color: 'red' }}>*Required fields</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ flex: 1, padding: 20, paddingTop: 0 }}>

                    <TextField
                        placeholder="Project ID"
                        required={false}
                        label="Project ID"
                        editable={false}
                        value={data.project_no ? data.project_no : item.project_no}
                    />

                    {/* <SelectPicker
                        label="Source"
                        required={true}
                        selectedValue={leadID}
                        onSelect={onSelectSourceLead}
                        options={sourceLead}
                    /> */}
                    <TextField
                        placeholder="Project created on"
                        label="Project created on"
                        required={false}
                        editable={false}
                        value={moment(data.created_at).format("YYYY/MM/DD")}
                    />

                    {/* <SelectPicker label="Assign To" required={true} /> */}

                    <TextField
                        placeholder="Client Name"
                        required={true}
                        label="Client Name"
                        value={data.client_name}
                        onChange={(data) => setData(prevState => ({ ...prevState, client_name: data }))}
                    />

                    <TextField
                        placeholder="Valid Singapore number"
                        required={true}
                        label="Contact Number"
                        value={data.contact_number}
                        onChange={(data) => setData(prevState => ({ ...prevState, contact_number: data }))}
                    />

                    <TextField
                        placeholder="Email"
                        required={false}
                        label="Email"
                        value={data.email}
                        onChange={(data) => setData(prevState => ({ ...prevState, email: data }))}
                    />

                    <Text style={{ marginTop: 20 }}>Address</Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            width: '100%',
                            justifyContent: 'space-between',
                            marginTop: -15,
                        }}
                    >
                        <View style={{ width: '49%' }}>
                            <TextField
                                placeholder="Road No."
                                required={false}
                                value={data.road_no}
                                onChange={(data) => setData(prevState => ({ ...prevState, road_no: data }))}
                            />
                        </View>
                        <View style={{ width: '49%' }}>
                            <TextField
                                placeholder="Residence"
                                required={false}
                                value={data.residence}
                                onChange={(residence) => {
                                    setData(prevState => ({ ...prevState, residence: residence }))
                                    setVenue(residence+' '+data.block_no+', '+data.road_name);
                                }}
                            />
                        </View>
                    </View>

                    <View
                        style={{
                            flexDirection: 'row',
                            width: '100%',
                            justifyContent: 'space-between',
                        }}
                    >
                        <View style={{ width: '49%' }}>
                            <TextField
                                placeholder="Road Name"
                                required={false}
                                value={data.road_name}
                                onChange={(road_name) => {
                                    setData(prevState => ({ ...prevState, road_name: road_name }))
                                    setVenue(data.residence+' '+data.block_no+', '+road_name);
                                }}
                            />
                        </View>
                        <View style={{ width: '49%' }}>
                            <TextField
                                placeholder="Postal Code"
                                required={false}
                                value={data.postal_code}
                                onChange={(data) => setData(prevState => ({ ...prevState, postal_code: data }))}
                            />
                        </View>
                    </View>

                    <View
                        style={{
                            flexDirection: 'row',
                            width: '100%',
                            justifyContent: 'space-between',
                        }}
                    >
                        <View style={{ width: '49%' }}>
                            <TextField
                                placeholder="Unit No."
                                required={false}
                                value={data.block_no}
                                onChange={(block_no) => {
                                    setData(prevState => ({ ...prevState, block_no: block_no }))
                                    setVenue(data.residence+' '+block_no+', '+data.road_name);
                                }}
                            />
                        </View>
                    </View>

                    {propertyTypeOption && (
                        <SelectPicker
                            label="Property Type"
                            required={true}
                            selectedValue={data.property_type_id ? data.property_type_id : item.property_type_id}
                            options={propertyTypeOption}
                            onSelect={onSelectPropertyType}
                        />
                    )}

                    <DatePicker
                        required={false}
                        label="Project Start Date"
                        initialDate={data.project_start || null}
                        selectedDate={data.project_start}
                        onChange={(data) => setData(prevState => ({ ...prevState, project_start: data }))}
                    />
                </View>

                {/* Appointment */}
                <View style={{ padding: 20, marginTop: -15 }}>
                    <Text>Work Schedule</Text>
                </View>
                {
                    (data.work_schedules && data.work_schedules.length < 1) &&
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
                    {
                        data.work_schedules && data.work_schedules.map((item, index) => {
                            return (<WorkSchedule key={index + 1} item={item} no={index + 1} onViewPress={() => console.log(index + 1)} />)
                        })
                    }
                </View>
                <TouchableOpacity onPress={toggleOverlay}>
                    <View
                        style={{
                            backgroundColor: 'white',
                            justifyContent: 'center',
                            height: 45,
                            marginTop: 5,
                            paddingHorizontal: 20,
                            flexDirection: 'row',
                        }}>
                        <View style={{ width: '50%', justifyContent: 'center' }}>
                            <Text style={{ color: 'black' }}>Add work schedule</Text>
                        </View>
                        <View
                            style={{
                                width: '50%',
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                            }}>
                            <Icon name="plus" size={30} color="black" />
                        </View>
                    </View>
                </TouchableOpacity>
                {/* Remark */}
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '50%' }}>
                        <Text style={{ marginLeft: 20, marginTop: 20 }}>Remarks</Text>
                    </View>
                </View>
                {
                    dataRemark.length > 0 ?
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
                                    data={dataRemark}
                                    circleSize={10}
                                    circleColor="grey"
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
                <TouchableOpacity onPress={remarkModalToggle}>
                    <View
                        style={{
                            backgroundColor: 'white',
                            justifyContent: 'center',
                            height: 45,
                            marginTop: 5,
                            paddingHorizontal: 20,
                            flexDirection: 'row',
                        }}>
                        <View style={{ width: '50%', justifyContent: 'center' }}>
                            <Text style={{ color: 'black' }}>Add new remark</Text>
                        </View>
                        <View
                            style={{
                                width: '50%',
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                            }}>
                            <Icon name="plus" size={30} color="black" />
                        </View>
                    </View>
                </TouchableOpacity>
                <DefaultButton
                    onPress={onSubmitUpdate}
                    textButton="SAVE CHANGES"
                />
            </ScrollView>
        </View >
    )
}

export default SalesEditScreen
