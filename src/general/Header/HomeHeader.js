import React, { Component, useEffect } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
const homeOption = ({ navigation }) => ({
    headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            <Icon name="menu-fold" size={30} color='white' style={{ marginLeft: 15 }} />
        </TouchableOpacity>
    ),
    title: (
        ''
    ),
    headerRight: (props) => {
        return (
            <View style={{ flexDirection: 'row' }}>
                {(navigation.getParam('needAttention') > 0) ? (
                    <TouchableOpacity onPress={() => navigation.push('Sales', { needAction: "need" })} >
                        <Text
                            style={{
                                color: '#fff',
                                position: 'absolute',
                                zIndex: 10,
                                top: 1,
                                left: -5,
                                padding: 1,
                                backgroundColor: 'red',
                                borderRadius: 5,
                                fontSize: 10
                            }}
                        >
                            {navigation.getParam('needAttention')}
                        </Text>
                        {navigation.getParam('needAttention') > 0}
                        <Icon name="bells" size={30} color='white' style={{ marginRight: 15 }} />
                    </TouchableOpacity>) :
                    (<TouchableOpacity >
                        <Text
                            style={{
                                color: '#fff',
                                position: 'absolute',
                                zIndex: 10,
                                top: 1,
                                left: -5,
                                padding: 1,
                                backgroundColor: 'red',
                                borderRadius: 5,
                                fontSize: 10
                            }}
                        >
                            {navigation.getParam('needAttention')}
                        </Text>
                        {navigation.getParam('needAttention') > 0}
                        <Icon name="bells" size={30} color='white' style={{ marginRight: 15 }} />
                    </TouchableOpacity>)
                }

                <TouchableOpacity >
                    <Icon name="setting" size={30} color='white' style={{ marginRight: 15 }} />
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
});

export default homeOption;