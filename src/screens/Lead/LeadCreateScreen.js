import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    Button,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
} from 'react-native';
import TextField from '../../components/TextField';
import SelectPicker from '../../components/SelectPicker';
import LongText from '../../components/LongText';
import DefaultButton from '../../components/DefaultButton';
import styles from './styles';
import Icon from 'react-native-vector-icons/AntDesign';
import { Card, Badge, Overlay } from 'react-native-elements';
import Timeline from 'react-native-timeline-flatlist';
import { RadioButton } from 'react-native-paper';
import moment from 'moment';
//REDUX
import { createLead, getLeadData } from '../../actions/leadAction';
import { useDispatch } from 'react-redux';
import { getPropertyType, getSourceLead } from '../../services/lead';
import {
    allUsers,
    getConditionTypes,
    getCountryCodeSource,
    getRemarkSource,
} from '../../services/config';
import { store } from '../../store/store';
import { Alert } from 'react-native';
import DatePicker from '../../components/DatePicker';
import { Platform } from 'react-native';
import { Dimensions } from 'react-native';
import { KeyboardAvoidingViewComponent } from 'react-native';
import { leadNormalSource, leadRefSource, salutations } from '../../constants/Lead';
const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
};

const LeadCreateScreen = ({ props, navigation }) => {
    const [leadID, setLeadID] = useState('');
    const [clientName, setClientName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [sourceLead, setSourceLead] = useState(1);
    const [budget, setBudget] = useState(0);
    const [remarks, setRemarks] = useState([]);
    const [conditionType, setConditionType] = useState('');
    const [moveInDate, setMoveInDate] = useState(new Date());
    const [memo, setMemo] = useState("");
    const [salutation, setSalutation] = useState(salutations[0]);
    const [country_code, setCountryCode] = useState("");

    const [postalCode, setPostalCode] = useState('');
    const [roadName, setRoadName] = useState('');
    const [roadNo, setRoadNo] = useState('');
    const [residence, setResidence] = useState('');
    const [blockNo, setBlockNo] = useState('');
    const [normalSource, setNormalSource] = useState('');
    const [normalSourceTwo, setNormalSourceTwo] = useState('');
    const [normalNotes, setNormalNotes] = useState('');

    const [status, setStatus] = useState('newlead');
    const [selectedAssign, setSelectedAssign] = useState(store.getState().loginReducer.id);

    const [sourceLeadOption, setSourceLeadOption] = useState([]);
    const [propertyTypeOption, setPropertyTypeOption] = useState([]);
    const [userSourceOption, setUserSourceOption] = useState([]);
    const [conditionTypeOption, setConditionTypeOption] = useState([]);
    const [countryCodes, setCountryCodes] = useState([]);

    // REMARK
    const [remarkCheck, setRemarkCheck] = useState('');
    const [remarkModal, setRemarkModal] = useState(false);
    const [remarkCheckboxes, setRemarkCheckboxes] = useState([]);
    const [remarkId, setRemarkId] = useState(0);
    useEffect(() => {
        getRemarkSource().then((data) => rebuildRemarkOption(data.data));
        getCountryCodeSource().then((data) => rebuildCountryCodeOption(data.data));
    }, []);

    const rebuildRemarkOption = (data) => {
        setRemarkCheckboxes([]);
        data.map((value) => {
            setRemarkCheckboxes((oldValue) => [
                ...oldValue,
                { id: value.id, value: value.name },
            ]);
        });
    };

    const rebuildCountryCodeOption = (data) => {
        setCountryCodes([]);
        data.map((value) => {
            setCountryCodes((oldValue) => [
                ...oldValue,
                { label: value.code + " - " + value.name, value: value.code, key: value.code },
            ]);
        });
    }

    const onClientNameChange = (name) => {
        setClientName(name);
    };

    const onPhoneNumberChange = (phone) => {
        setPhoneNumber(phone);
    };

    const onEmailChange = (email) => {
        setEmail(email);
    };

    const onSelectPropertyType = (data) => {
        setPropertyType(data);
    };

    const onSelectSourceLead = (data) => {
        setSourceLead(data);
    };

    const onPostalCodeChange = (data) => {
        setPostalCode(data);
    };

    const onRoadNameChange = (data) => {
        setRoadName(data);
    };

    const onRoadNoChange = (data) => {
        setRoadNo(data);
    };

    const onSelectStatus = (status) => {
        setStatus(status);
    };

    const dispatch = useDispatch();

    const validateRequiredInput = () => {
        let msg = '';
        let failCounter = 0;
        if (clientName == '' || clientName == null) {
            msg += 'Please fill client name \n';
            failCounter++;
        }
        if (phoneNumber == '' || phoneNumber == null) {
            msg += 'Please fill phone number \n';
            failCounter++;
        }
        if ((sourceLead == '' || sourceLead == null) && normalSource == "") {
            msg += 'Please choose source of lead \n';
            failCounter++;
        }
        if (normalSource == "Referral" && normalSourceTwo == "") {
            msg += 'Please choose source of lead \n';
            failCounter++;
        }
        // if((sourceLead == '' || sourceLead == null) && normalSource == "")
        // {
        //     msg += 'Please choose source of lead \n';
        //     failCounter++;
        // }
        if (selectedAssign == '' || selectedAssign == null) {
            msg += 'Please choose sales/designer \n';
            failCounter++;
        }
        if (propertyType == '' || propertyType == null) {
            msg += 'Please choose property type \n';
            failCounter++;
        }
        if (conditionType == '' || conditionType == null) {
            msg += 'Please choose condition type \n';
            failCounter++;
        }

        if (failCounter == 0) {
            //PASSED
            return { passed: true, msg }
        }

        return { passed: false, msg }
    }

    const onSubmitCreation = () => {
        const { passed, msg } = validateRequiredInput();
        if (!passed) {
            Alert.alert('Invalid Input', msg);
            return;
        }
        dispatch(
            createLead({
                clientName,
                email,
                phoneNumber,
                propertyType,
                status,
                sourceLead: sourceLead ? sourceLead : 1,
                postalCode,
                roadName,
                roadNo,
                residence,
                blockNo,
                selectedAssign,
                budget,
                remarks,
                conditionType,
                moveInDate,
                normal_option_source: normalSourceTwo ? normalSourceTwo : normalSource,
                normal_option_ref_notes: normalNotes,
                memo,
                salutation,
                country_code
            })
        );
        setRemarkCheck('');
        wait(1000).then(() => navigation.navigate('List', { filterStatus: '', needAttention: '' }));
    };

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
        getSourceLead().then((data) => {
            setSourceLeadOption([]);
            data.map((value) => {
                setSourceLeadOption((oldValue) => [
                    ...oldValue,
                    { label: value.name, value: value.id, key: value.name },
                ]);
            });
        });
        allUsers().then((data) => {
            setUserSourceOption([]);
            data.data.data.map((value) => {
                setUserSourceOption((oldValue) => [
                    ...oldValue,
                    { label: value.name, value: value.id, key: value.name },
                ]);
            });
        });
        getConditionTypes().then((data) => {
            setConditionTypeOption([]);
            data.data.map((value) => {
                setConditionTypeOption((oldValue) => [
                    ...oldValue,
                    { label: value.name, value: value.id, key: value.name },
                ]);
            });
        });
    }, []);

    const remarkModalToggle = () => {
        setRemarkModal(!remarkModal);
    };

    const addRemark = () => {
        let remarkItem = {
            time: moment(new Date()).format('DD/MM/YYYY'),
            title: remarkCheck,
            remark: remarkCheck,
            remark_id: remarkId,
        };

        setRemarks([...remarks, remarkItem]);
        setRemarkModal(!remarkModal);
        setRemarkCheck('');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 20}
            style={{
                flex: 1, 
                paddingBottom: 50, 
                alignItems: 'stretch',
                backgroundColor: '#F3F3F3'
            }}>
            <View>

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
                            Choose Remark
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
                            multiline={true}
                            value={remarkCheck}
                            onChange={(remark) => {
                                setRemarkCheck(remark);
                                setRemarkId(0);
                            }}
                        />
                        <DefaultButton onPress={addRemark} textButton="SAVE CHANGES" />
                    </View>
                </Overlay>


                <View style={{ padding: 20, paddingBottom: 0 }}>
                    <Text style={{ fontSize: 20 }}>Add New Lead</Text>
                    <Text style={{ fontSize: 14, color: 'red' }}>*Required fields</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 50 }}>
                    <View style={{ flex: 1, padding: 20, paddingTop: 0 }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                width: '100%',
                                justifyContent: 'space-between',
                            }}>
                            <View style={{ width: '30%' }}>
                                <SelectPicker
                                    label="Salutation"
                                    required={true}
                                    selectedValue={salutation}
                                    options={salutations}
                                    onSelect={(salutation) => setSalutation(salutation)}
                                />
                            </View>
                            <View style={{ width: '69%' }}>
                                <TextField
                                    key="client_name_creation"
                                    placeholder="Client Name"
                                    required={true}
                                    label="Client Name"
                                    value={clientName}
                                    onChange={(name) => onClientNameChange(name)}
                                />
                            </View>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                width: '100%',
                                justifyContent: 'space-between',
                            }}>
                            <View style={{ width: '30%' }}>
                                <SelectPicker
                                    label="Code"
                                    required={true}
                                    selectedValue={country_code}
                                    options={countryCodes}
                                    onSelect={(value) => setCountryCode(value)}
                                />
                            </View>
                            <View style={{ width: '69%' }}>
                                <TextField
                                    key="phone_creation"
                                    placeholder="Active phone number"
                                    required={true}
                                    label="Contact Number"
                                    keyboardType="phone-pad"
                                    value={phoneNumber}
                                    onChange={(phone) => onPhoneNumberChange(phone)}
                                />
                            </View>
                        </View>


                        {(store.getState().loginReducer.scopes.includes('lead-use-primary-source') && sourceLeadOption) ?
                            (
                                <SelectPicker
                                    label="Source"
                                    required={true}
                                    selectedValue={sourceLead}
                                    options={sourceLeadOption}
                                    onSelect={onSelectSourceLead}
                                />
                            ) :
                            (
                                <SelectPicker
                                    label="Source"
                                    required={true}
                                    selectedValue={normalSource}
                                    options={leadNormalSource}
                                    onSelect={(data) => {
                                        setNormalSource(data);
                                        if (data != "Referral") {
                                            setNormalSourceTwo("");
                                            setNormalNotes("");
                                        }
                                    }}
                                />
                            )
                        }

                        {
                            (normalSource == "Referral") &&
                            (
                                <SelectPicker
                                    selectedValue={normalSourceTwo}
                                    options={leadRefSource}
                                    onSelect={(data) => {
                                        setNormalSourceTwo(data);
                                    }}
                                />
                            )
                        }

                        {/* {
                        (normalSource == "Referral") &&
                        (
                            <LongText
                                multiline={true}
                                onChange={(data) => {
                                    setNormalNotes(data);
                                }}
                            />
                        )
                    } */}

                        {
                            store.getState().loginReducer.scopes.includes('lead-assign') &&
                            (
                                <SelectPicker
                                    label="Assign To"
                                    required={true}
                                    selectedValue={selectedAssign}
                                    onSelect={(data) => setSelectedAssign(data)}
                                    options={userSourceOption}
                                />
                            )
                        }


                        {propertyTypeOption && (
                            <SelectPicker
                                label="Property Type"
                                required={true}
                                selectedValue={propertyType}
                                options={propertyTypeOption}
                                onSelect={onSelectPropertyType}
                            />
                        )}

                        <SelectPicker
                            key="CONDITION_CREATE"
                            label="Condition Type"
                            required={true}
                            options={conditionTypeOption}
                            onSelect={(data) => setConditionType(data)}
                            selectedValue={conditionType}
                        />
                        <TextField
                            key="budget_creation"
                            placeholder="Amount"
                            required={false}
                            label="Budget"
                            keyboardType="numeric"
                            onChange={(data) => setBudget(data)}
                        />

                        <TextField
                            key="email_creation"
                            placeholder="Email"
                            required={false}
                            label="Email"
                            value={email}
                            onChange={(email) => onEmailChange(email)}
                        />

                        <Text style={{ marginTop: 20 }}>Address</Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                width: '100%',
                                justifyContent: 'space-between',
                                marginTop: -15,
                            }}>
                            <View style={{ width: '49%' }}>
                                <TextField
                                    key="block_creation"
                                    placeholder="Block/House No."
                                    required={false}
                                    onChange={(blockNo) => setBlockNo(blockNo)}
                                />
                            </View>
                            <View style={{ width: '49%' }}>
                                <TextField
                                    key="estate_creation"
                                    placeholder="Estate Name"
                                    required={false}
                                    onChange={(residence) => setResidence(residence)}
                                />
                            </View>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                width: '100%',
                                justifyContent: 'space-between',
                            }}>
                            <View style={{ width: '49%' }}>
                                <TextField
                                    key="road_creation"
                                    placeholder="Street/Road Name"
                                    required={false}
                                    onChange={(roadName) => onRoadNameChange(roadName)}
                                />
                            </View>
                            <View style={{ width: '49%' }}>
                                <TextField
                                    key="postal_creation"
                                    placeholder="Postal Code"
                                    required={false}
                                    keyboardType="numeric"
                                    onChange={(postalCode) => onPostalCodeChange(postalCode)}
                                />
                            </View>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                width: '100%',
                                justifyContent: 'space-between',
                            }}>
                            <View style={{ width: '49%' }}>
                                <TextField
                                    key="unit_creation"
                                    placeholder="Unit Number"
                                    required={false}
                                    onChange={(roadNo) => onRoadNoChange(roadNo)}
                                />
                            </View>
                        </View>

                        <DatePicker
                            testID='est_move_in_date'
                            label='Est. Move in date'
                            selectedDate={moveInDate}
                            onChange={(value) => setMoveInDate(value)}
                        />

                        <LongText
                            label='Memo'
                            value={memo}
                            onChange={(memo) => setMemo(memo)}
                        />
                        {/* <SelectPicker label="Lead Status" required={true} required={true} selectedValue={status} options={statusOption} onSelect={onSelectStatus} /> */}
                    </View>
                    <View>
                        {/* Remark */}
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: '50%', paddingHorizontal: 20 }}>
                                <Text>Remark</Text>
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
                                            style={style2.list}
                                            data={remarks}
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
                                        <Text style={{ color: '#808080' }}>No remarks yet</Text>
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

                        <DefaultButton onPress={onSubmitCreation} textButton="CREATE LEAD" />
                    </View>
                </ScrollView>

            </View >
        </KeyboardAvoidingView>
    );
};
const style2 = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 65,
        backgroundColor: 'white',
    },
    list: {
        flex: 1,
        marginTop: 20,
        marginLeft: 20,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    descriptionContainer: {
        flexDirection: 'row',
        paddingRight: 50,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    textDescription: {
        marginLeft: 10,
        color: 'gray',
    },
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 65,
        backgroundColor: 'white',
    },
    list: {
        flex: 1,
        marginTop: 20,
    },
    title: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'black',
    },
    descriptionContainer: {
        flexDirection: 'row',
        paddingRight: 50,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    textDescription: {
        marginLeft: 10,
        color: 'gray',
    },
});
export default LeadCreateScreen;
