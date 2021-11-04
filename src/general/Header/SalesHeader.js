import React, { useState } from 'react';
import { Alert } from 'react-native';
import { TouchableOpacity, View, Text } from 'react-native';
import { Overlay } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import DefaultButton from '../../components/DefaultButton';
import { approveAgreement } from '../../services/agreement';
import { approveQuotation } from '../../services/quotation';
import { approveSI } from '../../services/supplierInvoice';
import { store } from '../../store/store';
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
            const { item, type } = navigation.state.params;
            const [visible, setVisible] = useState(false);
            const toggleOverlay = () => {
                setVisible(!visible);
            };

            const approveQuo = quo_id => {
                approveQuotation(quo_id).then(
                    Alert.alert("Quotation has been approved")
                )
                toggleOverlay();
                navigation.navigate('SalesViewDocument',
                    { item: item, type: type, uri: "need-fetch" }
                )
            }
            return (
                <View style={{ flexDirection: 'row' }}>
                    <Overlay isVisible={visible} onBackdropPress={toggleOverlay} >
                        <View>
                            <Text>Are you sure want to approve this {(type == "Quotation/Agreement") ? "Quotation" : "Supplier Invoice"}</Text>
                            <DefaultButton textButton="Approve" onPress={() => approveQuo(item.id)} />
                        </View>
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

export const salesViewSIDocumentOption = ({ navigation }) => {
    return {
        title: (
            ''
        ),
        headerRight: props => {
            const { item } = navigation.state.params;
            const [visible, setVisible] = useState(false);
            const toggleOverlay = () => {
                setVisible(!visible);
            };

            const approveQuo = quo_id => {
                approveSI(quo_id).then(
                    Alert.alert("Supplier invoice has been approved")
                )
                toggleOverlay();
            }
            return (
                <View style={{ flexDirection: 'row' }}>
                    <Overlay isVisible={visible} onBackdropPress={toggleOverlay} >
                        <View>
                            <Text>Are you sure want to approve this Supplier Invoice?</Text>
                            <DefaultButton textButton="Approve" onPress={() => approveQuo(item.id)} />
                        </View>
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
            const { item } = navigation.state.params;
            const [visible, setVisible] = useState(false);
            const toggleOverlay = () => {
                setVisible(!visible);
            };

            const approveQuo = agreement_id => {
                approveAgreement(agreement_id).then(
                    Alert.alert("Agreement has been approved")
                )
                toggleOverlay();
            }
            return (
                <View style={{ flexDirection: 'row' }}>
                    <Overlay isVisible={visible} onBackdropPress={toggleOverlay} >
                        <View>
                            <Text>Are you sure want to approve this Agreement?</Text>
                            <DefaultButton textButton="Approve" onPress={() => approveQuo(item.id)} />
                        </View>
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