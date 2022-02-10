import React, { useState } from 'react';
import { Alert } from 'react-native';
import { TouchableOpacity, View, Text, Platform, Dimensions } from 'react-native';
import { Overlay } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import DefaultButton from '../../components/DefaultButton';
import { approveAgreement, rejectAgreement } from '../../services/agreement';
import { approveQuotation, rejectQuotation } from '../../services/quotation';
import { approveSI, rejectSI } from '../../services/supplierInvoice';
import { store } from '../../store/store';
import { RadioButton } from 'react-native-paper';
import LongText from '../../components/LongText';
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
                            store.getState().loginReducer.scopes.includes('DESIGNER') ?
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
                navigation.navigate('SalesView', { item: project_data })
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
                            <DefaultButton onPress={() => onReject(item.id)} textButton="SAVE CHANGES" />
                        </View>
                    </Overlay>
                    <Overlay isVisible={visible} onBackdropPress={toggleOverlay} >
                        {
                            store.getState().loginReducer.scopes.includes('DESIGNER') ?
                                (
                                    <View>
                                        {
                                            item.status == "Waiting Approval" && <Text>You don't have access to approve this document</Text>
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
                                    </View>) :
                                (
                                    <View>
                                        {
                                            item.status == "Waiting Approval" && <Text>Are you sure want to approve this Supplier Invoice?</Text>
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
                                            (item.status == "Waiting Approval" || item.status == "On Hold") && <DefaultButton textButton="YES" onPress={() => approveQuo(item.id)} />
                                        }
                                        {
                                            item.status == "Waiting Approval" && <DefaultButton textButton="ON HOLD" onPress={() => holdSI(item.id)} />
                                        }
                                        {
                                            (item.status == "Waiting Approval" || item.status == "On Hold") && <DefaultButton textButton="REJECT" onPress={CRToggle} />
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
                            store.getState().loginReducer.scopes.includes('DESIGNER') ?
                                (<View>
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

                                </View>) :
                                (<View>
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
                                </View>)
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