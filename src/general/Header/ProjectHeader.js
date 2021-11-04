import React, { useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Overlay } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';

export const projectOption = ({ navigation }) => {
    return {
        headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                <Icon name="menu-fold" size={30} color='white' style={{ marginLeft: 15 }} />
            </TouchableOpacity>
        ),
        title: (
            'PROJECT'
        ),
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

export const projectViewOption = ({ navigation }) => {
    return {
        title: (
            ''
        ),
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


export const  projectProgressSinglePhotoOption = ({ navigation }) => {
    return {
        title: (
            ''
        ),
        headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => navigation.push('ProgressEdit')}>
                    <Icon name="edit" size={25} color='white' style={{ marginRight: 15 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                    <Icon name="delete" size={25} color='white' style={{ marginRight: 20 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.push('PhotoDetail',{categoryName : navigation.getParam('categoryName'), item : navigation.getParam('item'), sow: navigation.getParam('sow')})}>
                    <Icon name="infocirlceo" size={25} color='white' style={{ marginRight: 20 }} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Icon name="ellipsis1" size={25} color='white' style={{ marginRight: 20 }} />
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
        headerTitleStyle: {
            letterSpacing: 5,
            color: 'white',
        },
        headerTintColor: 'white',

    }
};

export const projectProgressPhotosOption = ({ navigation }) => {
    return {
        title: (
            ''
        ),
        headerRight: () => (
            <TouchableOpacity onPress={() => navigation.push('ProgressCreate',{categoryName : navigation.getParam('categoryName'), area_id : navigation.getParam('area_id'), project_id : navigation.getParam('project_id')})}>
                <Icon name="plus" size={30} color='white' style={{ marginRight: 15 }} />
            </TouchableOpacity>
        ),
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

export const photoDetailOption = ({ navigation }) => {
    return {
        title: (
            ''
        ),
        headerRight: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                <Icon name="edit" size={30} color='white' style={{ marginRight: 15 }} />
            </TouchableOpacity>
        ),
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

export const progressEditOption = ({ navigation }) => {
    return {
        title: (
            ''
        ),
        headerRight: () => (
            <TouchableOpacity onPress={() => console.log('DELETED')}>
                <Icon name="delete" size={30} color='white' style={{ marginRight: 15 }} />
            </TouchableOpacity>
        ),
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

export const progressInspectionListOption = ({ navigation }) => {
    return {
        title: (
            ''
        ),
        headerRight: () => (
            <TouchableOpacity onPress={() => navigation.push('ProgressInspectionCreate')}>
                <Icon name="plus" size={30} color='white' style={{ marginRight: 15 }} />
            </TouchableOpacity>
        ),
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

export const progressInspectionEditOption = ({ navigation }) => {
    return {
        title: (
            ''
        ),
        headerRight: () => (
            <TouchableOpacity onPress={() => console.log('DELETED')}>
                <Icon name="delete" size={30} color='white' style={{ marginRight: 15 }} />
            </TouchableOpacity>
        ),
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

export const progressDefectListOption = ({ navigation }) => {
    return {
        title: (
            ''
        ),
        headerRight: () => (
            <TouchableOpacity onPress={() => navigation.push('ProgressDefectCreate')}>
                <Icon name="plus" size={30} color='white' style={{ marginRight: 15 }} />
            </TouchableOpacity>
        ),
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

export const progressDefectEditOption = ({ navigation }) => {
    return {
        title: (
            ''
        ),
        headerRight: () => (
            <TouchableOpacity onPress={() => console.log('DELETED')}>
                <Icon name="delete" size={30} color='white' style={{ marginRight: 15 }} />
            </TouchableOpacity>
        ),
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

export const  projectDefectViewOption = ({ navigation }) => {
    return {
        title: (
            ''
        ),
        headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => navigation.push('ProgressDefectEdit')}>
                    <Icon name="edit" size={25} color='white' style={{ marginRight: 15 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                    <Icon name="delete" size={25} color='white' style={{ marginRight: 20 }} />
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
        headerTitleStyle: {
            letterSpacing: 5,
            color: 'white',
        },
        headerTintColor: 'white',

    }
};