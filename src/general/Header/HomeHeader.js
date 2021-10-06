import React, { Component } from 'react';
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
    headerRight: () => (
        <View style={{flexDirection:'row'}}>
            <TouchableOpacity>
                <Icon name="bells" size={30} color='white' style={{ marginRight: 15 }} />
            </TouchableOpacity>
            <TouchableOpacity >
                <Icon name="setting" size={30} color='white' style={{ marginRight: 15 }} />
            </TouchableOpacity>
        </View>

    ),
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