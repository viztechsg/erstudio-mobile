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
import { getPropertyType } from '../../services/lead'
import { createSalesProject, getSalesData, updateSalesProject } from '../../actions/salesAction'
import { addProjectWorkSchedule, getSingleProject } from '../../services/sales'
import WorkSchedule from '../../components/Sales/WorkSchedule'

const SalesEditScreen = ({ props, navigation }) => {

    const { item } = navigation.state.params;

    const [data, setData] = useState([]);
    const [workSchedules, setWorkSchedules] = useState(item.work_schedules);

    const [leadID, setLeadID] = useState('')

    const [sourceLead, setSourceLead] = useState([])
    const [propertyTypeOption, setPropertyTypeOption] = useState([])

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
    const [vendor_id, setVendor] = useState(1);
    const [other_sow, setOtherSOW] = useState("");

    const SOWOption = [
        {
            'id': 'Kicthen',
            'name': 'Kitchen'
        },
        {
            'id': 'Tiling',
            'name': 'Tiling'
        },
        {
            'id': 'Roof',
            'name': 'Roof'
        },
        {
            'id': 'Other',
            'name': 'Other'
        },
    ]

    const VendorOption = [
        {
            'id': 1,
            'name': 'ABC PTE LTD'
        }
    ]


    const toggleOverlay = () => {
        setVisible(!visible)
    }

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
                    { id: value.id, name: value.runner_no },
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

        dispatch(getSalesData());
    }

    const addWorkSchedule = () => {
        // const { project_id, vendor_id, start_date, end_date, venue, scope_of_work } = data;
        //VALIDATE

        let finalSOW = scope_of_work;

        if(scope_of_work == 'Other')
        {
            if(other_sow == '')
            {
                Alert.alert("Warning", "Please fill Scope Of Work");
                return;
            }
            else{
                finalSOW = other_sow;
            }
        }

        let workSchedule = {
            project_id: item.id,
            vendor_id,
            venue,
            scope_of_work: finalSOW,
            start_date,
            end_date
        }
        
        addProjectWorkSchedule(workSchedule)
            .then(setWorkSchedules([...workSchedules, workSchedule]))
            .then(toggleOverlay());
    }

    useEffect(() => {
        let dispatched = false;
        dispatch(getLeadData())
        console.log(item);
        return () => {
            dispatched = true;
        }
    }, [])

    useEffect(() => {
        getPropertyType().then((data) => {
            setPropertyTypeOption(data)
            // setPropertyType(data[0].id)
        })
    }, [])

    useEffect(() => {
        let fetched = false;
        getSingleProject(item.id).then((data) => {
            setData(data)
        });
        return () => {
            fetched = true;
        }
    }, [item.id, workSchedules]);

    store.subscribe(() => {
        setSourceLead([])
        rebuildSourceLeadData(store.getState().leadsReducer.data)
    })

    return (
        <View
            style={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'stretch',
                backgroundColor: '#F3F3F3',
            }}
        >
            <Overlay
                isVisible={visible}
                onBackdropPress={toggleOverlay}
                overlayStyle={{ width: '80%' }}
            >
                <View>
                    <Text style={{ fontSize: 20, color: 'grey' }}>Schedule Details</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <View style={{ width: '49%' }}>
                            <DatePicker required={true} label="Start Date" key='DATE_START_1' onChange={startDate => setStartDate(startDate)} />
                        </View>
                        <View style={{ width: '49%' }}>
                            <DatePicker required={true} label="End Date" key='DATE_END_1' onChange={endDate => setEndDate(endDate)} />
                        </View>
                    </View>

                    <TextField placeholder="Venue" required={true} editable={true} label="Venue" onChange={venue => setVenue(venue)} />
                    <SelectPicker
                        key='VENDOR_PICKER'
                        label="Vendor"
                        required={true}
                        selectedValue={vendor_id}
                        onSelect={vendorId => setVendor(vendorId)}
                        options={VendorOption}
                    />

                    <SelectPicker
                        key='SOW_PICKER'
                        label="Scope of Work"
                        required={true}
                        selectedValue={scope_of_work}
                        onSelect={sow => setSOW(sow)}
                        options={SOWOption}
                    />

                    <LongText
                        key='SOW_OTHER'
                        onChange={otherSOW => setOtherSOW(otherSOW)}
                    />

                    <DefaultButton textButton="SAVE DETAILS"  onPress={addWorkSchedule} />
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
                        value={data.project_code ? data.project_code : item.project_code}
                    />

                    <SelectPicker
                        key={1}
                        label="Source"
                        required={true}
                        selectedValue={leadID}
                        onSelect={onSelectSourceLead}
                        options={sourceLead}
                    />
                    <TextField
                        placeholder="Project created on"
                        label="Project created on"
                        required={false}
                        editable={false}
                        value={moment(data.created_at).format("YYYY/MM/DD")}
                    />

                    <SelectPicker key={2} label="Assign To" required={true} />

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
                                onChange={(data) => setData(prevState => ({ ...prevState, residence: data }))}
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
                                onChange={(data) => setData(prevState => ({ ...prevState, road_name: data }))}
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
                                onChange={(data) => setData(prevState => ({ ...prevState, block_no: data }))}
                            />
                        </View>
                    </View>

                    {propertyTypeOption && (
                        <SelectPicker
                            key={3}
                            label="Property Type"
                            required={true}
                            selectedValue={data.property_type_id}
                            options={propertyTypeOption}
                            onSelect={onSelectPropertyType}
                        />
                    )}

                    <DatePicker
                        required={false}
                        label="Project Start Date"
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
                            return (<WorkSchedule item={item} no={index + 1} onViewPress={() => console.log(index + 1)} />)
                        })
                    }
                </View>
                <View
                    style={{
                        backgroundColor: 'white',
                        height: 45,
                        marginTop: 5,
                        paddingHorizontal: 20,
                        flexDirection: 'row',
                    }}
                >
                    <View style={{ width: '100%', justifyContent: 'center' }}>
                        <TouchableOpacity onPress={toggleOverlay} key="WS-BUTTON">
                            <Text style={{ color: 'black' }}>Work Schedule</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* Remark */}

                <View
                    style={{
                        backgroundColor: 'white',
                        padding: 30,
                        margin: -20,
                        marginTop: 15,
                        marginBottom: 3,
                    }}
                >
                    <Text style={{ marginTop: -20, marginLeft: 10 }}>Remark</Text>
                    <Timeline
                        style={styles.list}
                        data={leadCollection.leadRemakrs}
                        circleSize={10}
                        circleColor="grey"
                        lineColor="grey"
                        timeContainerStyle={{ minWidth: 93 }}
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
                <View
                    style={{
                        backgroundColor: 'white',
                        justifyContent: 'center',
                        height: 45,
                        marginTop: 5,
                        paddingHorizontal: 20,
                        flexDirection: 'row',
                    }}
                >
                    <View style={{ width: '50%', justifyContent: 'center' }}>
                        <Text style={{ color: 'black' }}>Add new remark</Text>
                    </View>
                    <View
                        style={{
                            width: '50%',
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                        }}
                    >
                        <Icon name="plus" size={30} color="black" />
                    </View>
                </View>
                <DefaultButton
                    onPress={onSubmitUpdate}
                    textButton="SAVE CHANGES"
                />
            </ScrollView>
        </View >
    )
}

export default SalesEditScreen
