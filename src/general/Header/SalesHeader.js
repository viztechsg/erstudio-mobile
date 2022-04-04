import React, { useState } from 'react';
import { Alert } from 'react-native';
import { TouchableOpacity, View, Text, Platform, Dimensions } from 'react-native';
import { Overlay } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import DefaultButton from '../../components/DefaultButton';
import { approveAgreement, rejectAgreement } from '../../services/agreement';
import { approveQuotation, rejectQuotation } from '../../services/quotation';
import { approveSI, holdSI, rejectSI } from '../../services/supplierInvoice';
import { store } from '../../store/store';
import { RadioButton } from 'react-native-paper';
import LongText from '../../components/LongText';
import TextField from '../../components/TextField';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAvoidingView } from 'react-native';
export const salesOption = ({ navigation }) => {
    return {
        headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                <Icon name="menu-fold" size={30} color='white' style={{ marginLeft: 15 }} />
            </TouchableOpacity>
        ),
        title: (
            'SALES'
        ),
        headerRight: props => {
            const [visible, setVisible] = useState(false);
            const toggleOverlay = () => {
                setVisible(!visible);
            };
            const navigateToRemark = () => {
                navigation.navigate('LeadRemark');
                setVisible(!visible);
            }
            return (
                <View style={{ flexDirection: 'row' }}>
                    <Overlay isVisible={visible} onBackdropPress={toggleOverlay} overlayStyle={{ width: '50%', height: 120, position: 'absolute', top: 57, right: 5, backgroundColor: 'black', color: 'white' }}>
                        <View>
                            <TouchableOpacity>
                                <View style={{ height: 58 }}>
                                    <Text style={{ color: 'white' }}>Export Project</Text>
                                </View>
                            </TouchableOpacity>
                            {/* <TouchableOpacity onPress={navigateToRemark}>
                                <View style={{ height: 58 }}>
                                    <Text style={{ color: 'white' }}>Check Log</Text>
                                </View>
                            </TouchableOpacity> */}
                        </View>
                    </Overlay>
                    {
                        store.getState().loginReducer.scopes.includes('project-create') &&
                        (
                            <TouchableOpacity onPress={() => navigation.navigate('SalesCreation')}>
                                <Icon name="plus" size={30} color='white' style={{ marginRight: 15 }} />
                            </TouchableOpacity>
                        )
                    }

                    <TouchableOpacity
                        onPress={toggleOverlay}>
                        <Icon name="ellipsis1" size={30} color='white' style={{ marginRight: 15 }} />
                    </TouchableOpacity>
                </View>
            )
        },
        headerStyle: {
            backgroundColor: 'black',
            shadowOpacity: 0.25,
            shadowOffset: {
                height: 1,
            },
            shadowRadius: 5,
        },
        headerTitleStyle: {
            letterSpacing: 5,
            color: 'white',
        },

    }
};

export const salesViewOption = ({ navigation }) => {
    return {
        title: (
            ''
        ),
        headerRight: props => {
            return (
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => navigation.navigate('SalesEdit', { item: navigation.getParam('item') })}>
                        <View style={{ width: 60, alignItems: 'center', justifyContent: 'center' }}>
                            <Icon name="edit" size={20} color='white' style={{ marginRight: 15 }} />
                        </View>
                    </TouchableOpacity>
                </View>
            )
        },
        headerStyle: {
            backgroundColor: 'black',
            shadowOpacity: 0.25,
            shadowOffset: {
                height: 1,
            },
            shadowRadius: 5,
        },
        headerTitleStyle: {
            letterSpacing: 5,
            color: 'white',
        },
        headerTintColor: 'white',

    }
};

export const salesViewDocumentOption = ({ navigation }) => {
    return {
        title: (
            ''
        ),
        headerRight: props => {
            const { item, type, project_data } = navigation.state.params;
            const [visible, setVisible] = useState(false);
            const [cancelReasonToggle, setCancelReasonToggle] = useState(false);
            const [CRValue, setCRValue] = useState('');
            const toggleOverlay = () => {
                setVisible(!visible);
            };

            const cancelReason = [
                {
                    value: 'No Answer',
                    id: 'No Answer',
                },
                {
                    value: 'Messages no reply',
                    id: 'Messages no reply',
                },
                {
                    value: 'Wrong number',
                    id: 'Wrong number',
                },
                {
                    value: 'Customer request call back',
                    id: 'Customer request call back',
                },
                {
                    value: 'Etc.',
                    id: 'Etc.',
                },
            ];

            const CRToggle = () => {
                setCancelReasonToggle(!cancelReasonToggle);
                setCRValue('');
            };

            const approveQuo = quo_id => {
                approveQuotation(quo_id).then(
                    Alert.alert("Approve Quotation", "Quotation has been approved")
                )
                toggleOverlay();
                // navigation.navigate('SalesViewDocument',
                //     { item: item, type: type, uri: "need-fetch" }
                // )
                navigation.navigate('SalesView', { item: project_data })
            }

            const rejectQuo = (quo_id) => {
                if (CRValue == '' || CRValue == null) {
                    Alert.alert('Reason', 'Please choose or type a reason');
                    return;
                }

                rejectQuotation(quo_id, CRValue)
                    .then(
                        toggleOverlay()
                    )
                    .then(
                        CRToggle()
                    )
                    .then(
                        Alert.alert('Reject Qotation', 'Quotation has been rejected')
                    )
                    .then(
                        navigation.navigate('SalesView', { item: project_data })
                    )
                // REJECT quotation
            }

            const onHold = () => {
                toggleOverlay();
                Alert.alert('Quotation On Hold', 'Quotation has been set to on hold');
                navigation.navigate('SalesView', { item: project_data })
            }

            return (
                <View style={{ flexDirection: 'row' }}>
                    {/* REMARK CANCEL REASON */}
                    <Overlay
                        key="CR"
                        isVisible={cancelReasonToggle}
                        onBackdropPress={CRToggle}
                        overlayStyle={{ width: '80%', height: Dimensions.height, marginBottom: Platform.OS == 'ios' ? 250 : 0 }}
                    >
                        <View>
                            <Text
                                style={
                                    {
                                        color: 'grey', fontWeight: '800', fontSize: 18, fontSize: 16,
                                        fontWeight: 'bold'
                                    }
                                }>
                                Cancel reason
                            </Text>
                            <LongText value={CRValue} onChange={(remark) => setCRValue(remark)} />
                            <DefaultButton onPress={() => rejectQuo(item.id)} textButton="SAVE CHANGES" />
                        </View>
                    </Overlay>
                    <Overlay isVisible={visible} onBackdropPress={toggleOverlay} overlayStyle={{ width: '80%', height: Dimensions.height, marginBottom: Platform.OS == 'ios' ? 250 : 0 }} >
                        {
                            store.getState().loginReducer.scopes.includes('quotation-approve') ?
                                (

                                    <View>
                                        {
                                            item.status == "draft" && <Text>This quotation still in draft</Text>
                                        }
                                        {
                                            item.status == "declined" && <Text>This quotation has been rejected, please create a new one</Text>
                                        }

                                        {
                                            item.status == "approved" && <Text>This quotation has approved</Text>
                                        }

                                        {
                                            item.status == "accepted" && <Text>This quotation has approved & signed</Text>
                                        }

                                        {
                                            item.status == "requested" && <Text>Are you sure want to approve this {(type == "Quotation") ? "Quotation" : "Supplier Invoice"} ?</Text>
                                        }

                                        {
                                            item.status == "requested" && <DefaultButton textButton="Approve" onPress={() => approveQuo(item.id)} />
                                        }

                                        {
                                            item.status == "requested" && <DefaultButton textButton="On Hold" onPress={onHold} />
                                        }

                                        {
                                            item.status == "requested" && <DefaultButton textButton="Reject" onPress={CRToggle} />
                                        }
                                    </View>
                                ) :
                                (
                                    <View>
                                        {
                                            item.status == "draft" && <Text>This quotation still in draft</Text>
                                        }
                                        {
                                            item.status == "declined" && <Text>This quotation has been rejected, please create a new one</Text>
                                        }

                                        {
                                            item.status == "approved" && <Text>This quotation has approved</Text>
                                        }

                                        {
                                            item.status == "accepted" && <Text>This quotation has approved & signed</Text>
                                        }

                                        {
                                            item.status == "requested" && <Text>You don't have access to approve this document</Text>
                                        }
                                    </View>
                                )
                        }

                    </Overlay>

                    <TouchableOpacity onPress={toggleOverlay}>
                        <View style={{ width: 60, alignItems: 'center', justifyContent: 'center' }}>
                            {
                                item.is_approved == 1 ? (<Icon name="check" size={30} color='green' style={{ marginRight: 15 }} />) : (<Icon name="warning" size={30} color='orange' style={{ marginRight: 15 }} />)
                            }

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={{ width: 60, alignItems: 'center', justifyContent: 'center' }}>
                            <Icon name="ellipsis1" size={30} color='white' style={{ marginRight: 15 }} />
                        </View>
                    </TouchableOpacity>
                </View>
            )
        },
        headerStyle: {
            backgroundColor: 'black',
            shadowOpacity: 0.25,
            shadowOffset: {
                height: 1,
            },
            shadowRadius: 5,
        },
        headerTitleStyle: {
            letterSpacing: 5,
            color: 'white',
        },
        headerTintColor: 'white',

    }
};

export const salesViewVODocumentOption = ({ navigation }) => {
    return {
        title: (
            ''
        ),
        headerRight: props => {
            const { item, project_data } = navigation.state.params;
            const [visible, setVisible] = useState(false);
            const [cancelReasonToggle, setCancelReasonToggle] = useState(false);
            const [CRValue, setCRValue] = useState('');
            const cancelReason = [
                {
                    value: 'No Answer',
                    id: 'No Answer',
                },
                {
                    value: 'Messages no reply',
                    id: 'Messages no reply',
                },
                {
                    value: 'Wrong number',
                    id: 'Wrong number',
                },
                {
                    value: 'Customer request call back',
                    id: 'Customer request call back',
                },
                {
                    value: 'Etc.',
                    id: 'Etc.',
                },
            ];

            const CRToggle = () => {
                setCancelReasonToggle(!cancelReasonToggle);
                setCRValue('');
            };
            const toggleOverlay = () => {
                setVisible(!visible);
            };

            const approveQuo = quo_id => {
                approveSI(quo_id).then(
                    Alert.alert("Supplier invoice has been approved")
                )
                toggleOverlay();
            }

            const onReject = si_id => {
                toggleOverlay();
                CRToggle();
                rejectSI(si_id, CRValue)
                    .then(
                        Alert.alert('Reject Supplier Invoice', 'Supplier Invoice has been rejected')
                    )
                    .then(
                        navigation.navigate('SalesView', { item: project_data })
                    )
            }

            const holdSI = si_id => {
                toggleOverlay();
                holdSI(si_id)
                    .then(
                        Alert.alert('Hold Supplier Invoice', 'Supplier Invoice has been rejected')
                    )
                    .then(
                        navigation.navigate('SalesView', { item: project_data })
                    )
            }
            return (
                <View style={{ flexDirection: 'row' }}>
                    {/* REMARK CANCEL REASON */}
                    {/* <TouchableOpacity onPress={toggleOverlay}>
                        <View style={{ width: 60, alignItems: 'center', justifyContent: 'center' }}>
                            {
                                item.is_approved == 1 ? (<Icon name="check" size={30} color='green' style={{ marginRight: 15 }} />) : (<Icon name="warning" size={30} color='orange' style={{ marginRight: 15 }} />)
                            }

                        </View>
                    </TouchableOpacity> */}
                    <TouchableOpacity>
                        <View style={{ width: 60, alignItems: 'center', justifyContent: 'center' }}>
                            <Icon name="ellipsis1" size={30} color='white' style={{ marginRight: 15 }} />
                        </View>
                    </TouchableOpacity>
                </View>
            )
        },
        headerStyle: {
            backgroundColor: 'black',
            shadowOpacity: 0.25,
            shadowOffset: {
                height: 1,
            },
            shadowRadius: 5,
        },
        headerTitleStyle: {
            letterSpacing: 5,
            color: 'white',
        },
        headerTintColor: 'white',

    }
};

export const salesViewSIDocumentOption = ({ navigation }) => {
    return {
        title: (
            ''
        ),
        headerRight: props => {
            const { item, project_data } = navigation.state.params;
            const [visible, setVisible] = useState(false);
            const [cancelReasonToggle, setCancelReasonToggle] = useState(false);
            const [onHoldReasonToggle, setOnHoldReasonToggle] = useState(false);
            const [partialApproveToggle, setPartialApproveToggle] = useState(false);
            const [CRValue, setCRValue] = useState('');
            const [SIRemark, setSIRemark] = useState("");
            const [approvedAmount, setApprovedAmount] = useState("");
            const [percentAmount, setPercentAmount] = useState(0);
            const cancelReason = [
                {
                    value: 'No Answer',
                    id: 'No Answer',
                },
                {
                    value: 'Messages no reply',
                    id: 'Messages no reply',
                },
                {
                    value: 'Wrong number',
                    id: 'Wrong number',
                },
                {
                    value: 'Customer request call back',
                    id: 'Customer request call back',
                },
                {
                    value: 'Etc.',
                    id: 'Etc.',
                },
            ];

            const sumApprovalLogs = () => {
                var sum_value = 0;
                item.approval_logs.map((value, index) => {
                    sum_value = sum_value + parseInt(value.approved_amount);
                });

                return sum_value.toString();
            }

            const summedApprovalLogs = sumApprovalLogs();

            const CRToggle = () => {
                toggleOverlay();
                setCancelReasonToggle(!cancelReasonToggle);
                setCRValue('');
            };

            const onHoldToggle = () => {
                toggleOverlay();
                setOnHoldReasonToggle(!onHoldReasonToggle);
                setCRValue('');
            };

            const partialAppToggle = () => {
                toggleOverlay();
                setPartialApproveToggle(!partialApproveToggle);
            }

            const toggleOverlay = () => {
                setVisible(!visible);
            };

            const approveQuo = quo_id => {
                approveSI(quo_id, "full", SIRemark, item.amount).then(
                    Alert.alert("Supplier invoice has been fully approved")
                )
                toggleOverlay();
                navigation.navigate('SalesView', { item: project_data })
            }

            const approvePartial = si_id => {
                if (parseFloat(approvedAmount) + parseFloat(summedApprovalLogs) > parseFloat(item.amount)) {
                    Alert.alert("Approved amount cannot be greater than invoice amount");
                    return;
                }

                approveSI(si_id, "partial", SIRemark, approvedAmount).then(
                    Alert.alert("Supplier invoice has been approved partially")
                )
                partialAppToggle();
                toggleOverlay();
                navigation.navigate('SalesView', { item: project_data })
            }

            const onReject = si_id => {

                if (CRValue == "") {
                    Alert.alert("Invalid Input", "Please type a reason");
                    return;
                }
                rejectSI(si_id, CRValue)
                    .then(
                        Alert.alert('Reject Supplier Invoice', 'Supplier Invoice has been rejected')
                    )
                    .then(
                        navigation.navigate('SalesView', { item: project_data })
                    )
                toggleOverlay();
                CRToggle();
                setCRValue("");
            }

            useEffect(() => {
                var remarks = '';
                item.approval_logs.map((value, index) => {
                    if (value.remark != null) {
                        remarks = value.remark + "\n"
                    }
                });

                setSIRemark(remarks);
            }, [item.id])

            const _holdSI = si_id => {

                if (CRValue == "") {
                    Alert.alert("Invalid Input", "Please type a reason");
                    return;
                }

                holdSI(si_id, CRValue)
                    .then(
                        Alert.alert('Hold Supplier Invoice', 'Supplier Invoice has been holded')
                    )

                toggleOverlay();
                onHoldToggle();
                navigation.navigate('SalesView', { item: project_data })
                setCRValue("");
            }
            return (
                <View style={{ flexDirection: 'row' }}>

                    {/* REMARK CANCEL REASON */}
                    <Overlay
                        key="CR_SI"
                        isVisible={cancelReasonToggle}
                        onBackdropPress={CRToggle}
                        overlayStyle={{ width: '80%', height: Dimensions.height, marginBottom: Platform.OS == 'ios' ? 250 : 0 }}
                    >
                        <View>
                            <Text
                                style={
                                    {
                                        color: 'grey', fontWeight: '800', fontSize: 18, fontSize: 16,
                                        fontWeight: 'bold'
                                    }
                                }>
                                Cancel reason
                            </Text>
                            <LongText value={CRValue} onChange={(remark) => setCRValue(remark)} />
                            <DefaultButton onPress={() => onReject(item.id)} textButton="SAVE CHANGES" />
                        </View>
                    </Overlay>

                    {/* REMARK ONHOLD REASON */}
                    <Overlay
                        key="ONHOLD_REASON"
                        isVisible={onHoldReasonToggle}
                        onBackdropPress={onHoldToggle}
                        overlayStyle={{ width: '80%',  overflow: 'hidden', marginBottom: Platform.OS == 'ios' ? 250 : 0}}
                    >
                        <SafeAreaView>
                            <KeyboardAvoidingView key="ONHOLD_REASON_KAV" behavior="position" keyboardVerticalOffset={Platform.OS === "ios" ? 200 : 0}>
                                <Text
                                    style={
                                        {
                                            color: 'grey', fontWeight: '800', fontSize: 18, fontSize: 16,
                                            fontWeight: 'bold'
                                        }
                                    }>
                                    On Hold Reason
                                </Text>
                                <LongText value={CRValue} onChange={(remark) => setCRValue(remark)} />
                                <DefaultButton onPress={() => _holdSI(item.id)} textButton="SAVE CHANGES" />
                            </KeyboardAvoidingView>
                        </SafeAreaView>
                    </Overlay>

                    {/* OVERLAY PARTIAL APPROVE */}

                    <Overlay
                        key="PARTIAL_APPROVE"
                        isVisible={partialApproveToggle}
                        onBackdropPress={partialAppToggle}
                        overlayStyle={{ width: '80%', overflow: 'hidden'  }}
                    >

                        <SafeAreaView>
                            <KeyboardAvoidingView key="ONHOLD_REASON_KAV_2" behavior="position" keyboardVerticalOffset={Platform.OS === "ios" ? 180 : 0}>
                                <ScrollView>
                                    <Text
                                        style={
                                            {
                                                color: 'grey', fontWeight: '800', fontSize: 18, fontSize: 16,
                                                fontWeight: 'bold'
                                            }
                                        }>
                                        Fill Amount
                                    </Text>
                                    <TextField label="Supplier Invoice Amount" editable={false} value={item.amount} />
                                    <TextField label="Approved Amount" editable={false} value={summedApprovalLogs} />
                                    <TextField label="Percentage" keyboardType="number-pad" value={percentAmount.toString()} onChange={(value) => {
                                        setPercentAmount(value);
                                        var app_amount = item.amount * (value / 100);
                                        setApprovedAmount(app_amount.toFixed(2).toString());
                                    }}
                                    />

                                    <TextField label="Amount" required={true} keyboardType="number-pad" value={approvedAmount} onChange={(value) => {
                                        setApprovedAmount(value);
                                        var percent = (value / item.amount) * 100;
                                        setPercentAmount(percent.toFixed(1).toString());
                                    }} />
                                    <LongText label="Remark" value={SIRemark} onChange={(remark) => setSIRemark(remark)} />
                                </ScrollView>
                                <View>

                                    <DefaultButton onPress={() => approvePartial(item.id)} textButton="SAVE CHANGES" />
                                </View>
                            </KeyboardAvoidingView>
                        </SafeAreaView>

                    </Overlay>

                    <Overlay isVisible={visible} onBackdropPress={toggleOverlay} style={{width:'90%'}} >
                        {
                            store.getState().loginReducer.scopes.includes('supplier-invoice-approve') ?
                                (
                                    <View>
                                        {
                                            (item.status == "Pending" || item.status == "Approved (Partial)") && <Text>Are you sure want to approve this Supplier Invoice?</Text>
                                        }

                                        {
                                            item.status == "Approved" && <Text>This Supplier Invoice already approved</Text>
                                        }

                                        {
                                            item.status == "On Hold" && <Text>This Supplier Invoice still on hold</Text>
                                        }

                                        {
                                            item.status == "Rejected" && <Text>This Supplier Invoice already rejected</Text>
                                        }

                                        {
                                            (item.status == "Pending" || item.status == "On Hold" || item.status == "Approved (Partial)") && <DefaultButton textButton="APPROVE (FULL)" onPress={() => approveQuo(item.id)} />
                                        }

                                        {
                                            (item.status == "Pending" || item.status == "On Hold" || item.status == "Approved (Partial)") && <DefaultButton textButton="APPROVE (Partial)" onPress={partialAppToggle} />
                                        }
                                        {
                                            item.status == "Pending" && <DefaultButton textButton="ON HOLD" onPress={onHoldToggle} />
                                        }
                                        {
                                            (item.status == "Pending" || item.status == "On Hold") && <DefaultButton textButton="REJECT" onPress={CRToggle} />
                                        }
                                    </View>
                                ) :
                                (
                                    <View>
                                        {
                                            (item.status == "Pending" || item.status == "Approved (Partial)") && <Text>You don't have access to approve this document</Text>
                                        }

                                        {
                                            item.status == "Approved" && <Text>This Supplier Invoice already approved</Text>
                                        }

                                        {
                                            item.status == "On Hold" && <Text>This Supplier Invoice still on hold</Text>
                                        }

                                        {
                                            item.status == "Rejected" && <Text>This Supplier Invoice already rejected</Text>
                                        }
                                    </View>)
                        }
                    </Overlay>
                    <TouchableOpacity onPress={toggleOverlay}>
                        <View style={{ width: 60, alignItems: 'center', justifyContent: 'center' }}>
                            {
                                item.is_approved == 1 ? (<Icon name="check" size={30} color='green' style={{ marginRight: 15 }} />) : (<Icon name="warning" size={30} color='orange' style={{ marginRight: 15 }} />)
                            }

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={{ width: 60, alignItems: 'center', justifyContent: 'center' }}>
                            <Icon name="ellipsis1" size={30} color='white' style={{ marginRight: 15 }} />
                        </View>
                    </TouchableOpacity>
                </View>
            )
        },
        headerStyle: {
            backgroundColor: 'black',
            shadowOpacity: 0.25,
            shadowOffset: {
                height: 1,
            },
            shadowRadius: 5,
        },
        headerTitleStyle: {
            letterSpacing: 5,
            color: 'white',
        },
        headerTintColor: 'white',

    }
};

export const salesViewAgreementDocumentOption = ({ navigation }) => {
    return {
        title: (
            ''
        ),
        headerRight: props => {

            const { item, type, project_data } = navigation.state.params;
            const [visible, setVisible] = useState(false);
            const [cancelReasonToggle, setCancelReasonToggle] = useState(false);
            const [CRValue, setCRValue] = useState('');

            const cancelReason = [
                {
                    value: 'No Answer',
                    id: 'No Answer',
                },
                {
                    value: 'Messages no reply',
                    id: 'Messages no reply',
                },
                {
                    value: 'Wrong number',
                    id: 'Wrong number',
                },
                {
                    value: 'Customer request call back',
                    id: 'Customer request call back',
                },
                {
                    value: 'Etc.',
                    id: 'Etc.',
                },
            ];

            const CRToggle = () => {
                setCancelReasonToggle(!cancelReasonToggle);
                setCRValue('');
            };

            const rejectQuo = (quo_id) => {
                if (CRValue == '' || CRValue == null) {
                    Alert.alert('Reason', 'Please choose or type a reason');
                    return;
                }

                rejectAgreement(quo_id, CRValue)
                    .then(
                        toggleOverlay()
                    )
                    .then(
                        CRToggle()
                    )
                    .then(
                        Alert.alert('Reject Agreement', 'Agreement has been rejected')
                    )
                    .then(
                        navigation.navigate('SalesView', { item: project_data })
                    )
                // REJECT quotation
            }

            const onHold = () => {
                toggleOverlay();
                Alert.alert('Agreement On Hold', 'Agreement has been set to on hold');
                navigation.navigate('SalesView', { item: project_data })
            }

            const toggleOverlay = () => {
                setVisible(!visible);
            };

            const approveQuo = agreement_id => {
                approveAgreement(agreement_id).then(
                    Alert.alert("Agreement has been approved")
                )
                toggleOverlay();
                navigation.navigate('SalesView', { item: project_data })
            }
            return (
                <View style={{ flexDirection: 'row' }}>
                    <Overlay
                        key="CR"
                        isVisible={cancelReasonToggle}
                        onBackdropPress={CRToggle}
                        overlayStyle={{ width: '80%', height: Dimensions.height, marginBottom: Platform.OS == 'ios' ? 250 : 0 }}
                    >
                        <View>
                            <Text
                                style={
                                    {
                                        color: 'grey', fontWeight: '800', fontSize: 18, fontSize: 16,
                                        fontWeight: 'bold'
                                    }
                                }>
                                Cancel reason
                            </Text>
                            {/* {cancelReason.map((item, index) => {
                                return (
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <RadioButton.Android
                                            value={item.value}
                                            status={CRValue == item.value ? 'checked' : 'unchecked'}
                                            onPress={() => setCRValue(item.value)}
                                        />
                                        <Text style={{ fontSize: 14 }}>{item.value}</Text>
                                    </View>
                                );
                            })} */}
                            <LongText value={CRValue} onChange={(remark) => setCRValue(remark)} />
                            <DefaultButton onPress={() => rejectQuo(item.id)} textButton="SAVE CHANGES" />
                        </View>
                    </Overlay>
                    <Overlay isVisible={visible} onBackdropPress={toggleOverlay} overlayStyle={{ width: '80%', height: Dimensions.height, marginBottom: Platform.OS == 'ios' ? 250 : 0 }} >
                        {
                            store.getState().loginReducer.scopes.includes('agreement-approve') ?
                                (
                                    <View>
                                        {
                                            item.status == "declined" && <Text>This agreement has been rejected, please create a new one</Text>
                                        }

                                        {
                                            item.status == "approved" && <Text>This agreement has approved</Text>
                                        }

                                        {
                                            item.status == "accepted" && <Text>This quotation has approved & signed</Text>
                                        }

                                        {
                                            item.status == "requested" && <Text>Are you sure want to approve this {(type == "Agreement") ? "Agreement" : "Supplier Invoice"} ?</Text>
                                        }

                                        {
                                            item.status == "requested" && <DefaultButton textButton="Approve" onPress={() => approveQuo(item.id)} />
                                        }

                                        {
                                            item.status == "requested" && <DefaultButton textButton="On Hold" onPress={onHold} />
                                        }

                                        {
                                            item.status == "requested" && <DefaultButton textButton="Reject" onPress={CRToggle} />
                                        }
                                    </View>) :
                                (
                                    <View>
                                        {
                                            item.status == "declined" && <Text>This agreement has been rejected, please create a new one</Text>
                                        }

                                        {
                                            item.status == "approved" && <Text>This agreement has approved</Text>
                                        }

                                        {
                                            item.status == "accepted" && <Text>This quotation has approved & signed</Text>
                                        }

                                        {
                                            item.status == "requested" && <Text>You don't have access to approve this document</Text>
                                        }

                                    </View>
                                )
                        }
                    </Overlay>
                    <TouchableOpacity onPress={toggleOverlay} key="TOCUAHSD">
                        <View style={{ width: 60, alignItems: 'center', justifyContent: 'center' }}>
                            {
                                item.is_approved == 1 ? (<Icon name="check" size={30} color='green' style={{ marginRight: 15 }} />) : (<Icon name="warning" size={30} color='orange' style={{ marginRight: 15 }} />)
                            }

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={{ width: 60, alignItems: 'center', justifyContent: 'center' }}>
                            <Icon name="ellipsis1" size={30} color='white' style={{ marginRight: 15 }} />
                        </View>
                    </TouchableOpacity>
                </View>
            )
        },
        headerStyle: {
            backgroundColor: 'black',
            shadowOpacity: 0.25,
            shadowOffset: {
                height: 1,
            },
            shadowRadius: 5,
        },
        headerTitleStyle: {
            letterSpacing: 5,
            color: 'white',
        },
        headerTintColor: 'white',

    }
};