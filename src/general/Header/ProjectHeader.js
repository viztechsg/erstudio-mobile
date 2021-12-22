import React, { useState } from 'react';
import { Alert } from 'react-native';
import { TouchableOpacity, View, Text } from 'react-native';
import { Overlay } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import DefaultButton from '../../components/DefaultButton';
import { deleteProjectProgressPhoto } from '../../services/project';
import { deleteDefect } from '../../services/projectDefect';
const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
};

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


export const projectProgressSinglePhotoOption = ({ navigation }) => {
    return {
        title: (
            ''
        ),
        headerRight: props => {
            const { item, area_id, project_id, categoryName } = navigation.state.params;
            const [visible, setVisible] = useState(false);

            const toggle = () => {
                setVisible(!visible);
            }

            const deletePhoto = () => {
                deleteProjectProgressPhoto(item.id).then( data => Alert.alert("Delete photo",data)).then(toggle()).then(
                    wait(1500).then( navigation.navigate('ProjectProgressPhoto', {
                        categoryName: categoryName, area_id: area_id, project_id: project_id
                    }))
                );
            }

            return (

                <View style={{ flexDirection: 'row' }}>
                    <Overlay
                        key="CR_SI"
                        isVisible={visible}
                        onBackdropPress={toggle}
                        overlayStyle={{ width: '80%' }}
                    >
                        <View>
                            <Text
                                style={
                                    {
                                        color: 'grey', fontWeight: '800', fontSize: 18, fontSize: 16,
                                        fontWeight: 'bold'
                                    }
                                }>
                                Are you sure want to delete this photo?
                            </Text>
                            <View style={{ justifyContent: 'space-around' }}>
                                <View style={{ widh: '50%' }}>
                                    <DefaultButton onPress={() => deletePhoto()} textButton="YES" />
                                </View>
                                <View style={{ widh: '50%' }}>
                                    <DefaultButton onPress={() => toggle()} textButton="CANCEL" />
                                </View>
                            </View>

                        </View>
                    </Overlay>
                    <TouchableOpacity onPress={() => navigation.push('ProgressEdit', { categoryName: navigation.getParam('categoryName'), item: navigation.getParam('item'), sow: navigation.getParam('sow') })}>
                        <Icon name="edit" size={25} color='white' style={{ marginRight: 15 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => toggle()}>
                        <Icon name="delete" size={25} color='white' style={{ marginRight: 20 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.push('PhotoDetail', { categoryName: navigation.getParam('categoryName'), item: navigation.getParam('item'), sow: navigation.getParam('sow') })}>
                        <Icon name="infocirlceo" size={25} color='white' style={{ marginRight: 20 }} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Icon name="ellipsis1" size={25} color='white' style={{ marginRight: 20 }} />
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

export const projectProgressPhotosOption = ({ navigation }) => {
    return {
        title: (
            ''
        ),
        headerRight: () => (
            <TouchableOpacity onPress={() => navigation.push('ProgressCreate', { categoryName: navigation.getParam('categoryName'), area_id: navigation.getParam('area_id'), project_id: navigation.getParam('project_id') })}>
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
            <TouchableOpacity onPress={() => navigation.push('ProgressInspectionCreate', { project_id: navigation.getParam('project_id') })}>
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
            <TouchableOpacity onPress={() => navigation.push('ProgressDefectCreate', { project_id: navigation.getParam('project_id'),project: navigation.getParam('project') })}>
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
        headerRight: () => {
            const { defect_id, defect, project } = navigation.state.params;
            const [visible, setVisible] = useState(false);

            const toggle = () => {
                setVisible(!visible);
            }

            const onDelete = () => {
                deleteDefect(defect_id).then( data => Alert.alert("Delete defect",data)).then(toggle()).then(
                    wait(1500).then( navigation.navigate('ProgressDefectList', {
                        project
                    }))
                );
            }
            return (
            <View style={{ flexDirection: 'row' }}>
                <Overlay
                        key="ASDVCASASD"
                        isVisible={visible}
                        onBackdropPress={toggle}
                        overlayStyle={{ width: '80%' }}
                    >
                        <View>
                            <Text
                                style={
                                    {
                                        color: 'grey', fontWeight: '800', fontSize: 18, fontSize: 16,
                                        fontWeight: 'bold'
                                    }
                                }>
                                Are you sure want to delete this item?
                            </Text>
                            <View style={{ justifyContent: 'space-around' }}>
                                <View style={{ widh: '50%' }}>
                                    <DefaultButton onPress={() => onDelete()} textButton="YES" />
                                </View>
                                <View style={{ widh: '50%' }}>
                                    <DefaultButton onPress={() => toggle()} textButton="CANCEL" />
                                </View>
                            </View>

                        </View>
                    </Overlay>
                
                <TouchableOpacity onPress={toggle}>
                    <Icon name="delete" size={25} color='white' style={{ marginRight: 15 }} />
                </TouchableOpacity>
            </View>
        )},
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

export const projectDefectViewOption = ({ navigation }) => {
    return {
        title: (
            ''
        ),
        headerRight: () => {
            const { defect_id, defect, project } = navigation.state.params;
            const [visible, setVisible] = useState(false);

            const toggle = () => {
                setVisible(!visible);
            }

            const onDelete = () => {
                deleteDefect(defect_id).then( data => Alert.alert("Delete defect",data)).then(toggle()).then(
                    wait(1500).then( navigation.navigate('ProgressDefectList', {
                        project
                    }))
                );
            }
            return (
            <View style={{ flexDirection: 'row' }}>
                <Overlay
                        key="ASDVCASASD"
                        isVisible={visible}
                        onBackdropPress={toggle}
                        overlayStyle={{ width: '80%' }}
                    >
                        <View>
                            <Text
                                style={
                                    {
                                        color: 'grey', fontWeight: '800', fontSize: 18, fontSize: 16,
                                        fontWeight: 'bold'
                                    }
                                }>
                                Are you sure want to delete this item?
                            </Text>
                            <View style={{ justifyContent: 'space-around' }}>
                                <View style={{ widh: '50%' }}>
                                    <DefaultButton onPress={() => onDelete()} textButton="YES" />
                                </View>
                                <View style={{ widh: '50%' }}>
                                    <DefaultButton onPress={() => toggle()} textButton="CANCEL" />
                                </View>
                            </View>

                        </View>
                    </Overlay>
                <TouchableOpacity onPress={() => navigation.push('ProgressDefectEdit', { defect_id: navigation.getParam('defect_id'), defect: navigation.getParam('defect'), project: navigation.getParam('project') })}>
                    <Icon name="edit" size={25} color='white' style={{ marginRight: 15 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggle}>
                    <Icon name="delete" size={25} color='white' style={{ marginRight: 20 }} />
                </TouchableOpacity>
            </View>
        )},
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