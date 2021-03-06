import React, { useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Overlay } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import { store } from '../../store/store';
import { HeaderBackButton } from 'react-navigation-stack';
export const leadsOption = ({ navigation }) => {
    return {
        headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                <Icon name="menu-fold" size={30} color='white' style={{ marginLeft: 15 }} />
            </TouchableOpacity>
        ),
        title: (
            'MARKETING'
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
                                    <Text style={{ color: 'white' }}>Export Leads</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={navigateToRemark}>
                                <View style={{ height: 58 }}>
                                    <Text style={{ color: 'white' }}>Check Log</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </Overlay>
                    {
                        store.getState().loginReducer.scopes.includes('lead-create') &&
                        (
                            <TouchableOpacity onPress={() => navigation.navigate('LeadCreation')}>
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

export const leadsViewOption = ({ navigation }) => {
    return {
        title: (
            ''
        ),
        headerRight: props => {
            return (
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => navigation.push('LeadEdit', { item: navigation.getParam('item') })}>
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

export const leadsEditOption = ({ navigation }) => {
    return {
        headerLeft: (
            <HeaderBackButton style={{width:100}} tintColor='white' style={{color:'white'}} onPress={() => { navigation.navigate('List', { filterStatus: '',needAttention: '' }) }} />
        ),
        title: '',
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: 'black',
            shadowOpacity: 0.25,
            shadowOffset: {
                height: 1,
            },
            shadowRadius: 5,
        },
    }
}