import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Button, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import TextField from '../../../components/TextField';
import SelectPicker from '../../../components/SelectPicker';
import LongText from '../../../components/LongText';
import DefaultButton from '../../../components/DefaultButton';
import ImageField from '../../../components/ImageField';
import InspectionRadioGroup from '../../../components/Project/InspectionRadioGroup';
import Icon from 'react-native-vector-icons/AntDesign';
import InspectionRemarkItem from '../../../components/Project/InspectionRemarkItem';

const InspectionEditScreen = ({ props, navigation }) => {
    const onSubmitCreation = () => {
        Alert.alert('Success', 'Progress added')
    }

    const [inspectionListData, setInspectionListData] = useState({});

    const inspectionList = [
        {
            id: 1,
            desc: 'Grouting between tiles uneven (leveling)'
        },
        {
            id: 2,
            desc: 'Grouting between tiles uneven (leveling)'
        },
        {
            id: 3,
            desc: 'Grouting between tiles uneven (leveling)'
        },
        {
            id: 4,
            desc: 'Grouting between tiles uneven (leveling)'
        },
    ]

    const onSelectRadio = ({ inspectionId, value }) => {
        setInspectionListData({ inspectiondId: 1, value: value });
        console.log(inspectionListData);
    }

    const renderInspectionList = (inspectionList) => {
        return inspectionList.map((item) => {
            return (
                <View style={{ marginTop: 15 }}>
                    <Text>{item.desc}</Text>
                    <View
                        style={{
                            borderRadius: 5,
                            backgroundColor: '#CDD0CB',
                            height: 55,
                            marginTop: 5,
                            padding: 5,
                            justifyContent: 'center'
                        }}
                    >
                        <InspectionRadioGroup key={item.id} onViewPress={() => console.log('SELECTED')} />
                    </View>
                </View>
            )
        })
    }

    return (
        <View style={{
            flex: 1,
            flexDirection: 'column',
            // alignItems: 'stretch',
            padding: 20,
            backgroundColor: '#F3F3F3',
        }}>
            <View>
                <Text style={{ fontSize: 20 }}>Edit Inspection</Text>
                <Text style={{ fontSize: 14, color: 'red' }}>*Required fields</Text>
            </View>
            <View style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <SelectPicker label="Scope of inspection" required={true} />
                    <SelectPicker label="Scope of work" required={true} />
                    <SelectPicker label="Vendor" required={true} />
                    <SelectPicker label="Status" required={true} />
                    <Text style={{ marginTop: 20 }}>Inspection List</Text>
                    {renderInspectionList(inspectionList)}
                    <SelectPicker label="Inspection Result" required={true} />
                    <Text style={{ marginTop: 20 }}>Add photos</Text>

                    {/* PHOTO SECTION */}
                    <View style={{ marginTop: 10, backgroundColor: 'white', height: 150, padding: 10, flexDirection: 'row' }}>
                        <TouchableOpacity>
                            <View style={{ height: 130, width: 150, borderColor: 'grey', borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center' }}>
                                <Icon name="pluscircleo" size={60} color="grey" />
                            </View>
                        </TouchableOpacity>

                    </View>

                    {/* REMARK SECTION */}
                    <Text style={{ marginTop: 20 }}>Remarks</Text>
                    <View>
                        <InspectionRemarkItem onViewPress={() => console.log('PRESSED')} />
                        <InspectionRemarkItem onViewPress={() => console.log('PRESSED')} />
                    </View>
                    <TouchableOpacity onPress={() => console.log('PRESSED')}>
                        <View style={{ backgroundColor: 'white', justifyContent: 'center', height: 45, marginTop: 5, paddingHorizontal: 20, flexDirection: 'row', marginBottom: 20 }}>
                            <View style={{ width: '50%', justifyContent: 'center' }}>
                                <Text style={{ color: 'black' }}>Add new remark</Text>
                            </View>

                            <View 
                                style={{ 
                                    width: '50%', 
                                    alignItems: 'flex-end', 
                                    justifyContent: 'center' }}
                            >
                                <Icon name="plus" size={30} color="black" />
                            </View>

                        </View>
                    </TouchableOpacity>
                </ScrollView>
                <SafeAreaView>
                    <DefaultButton onPress={() => onSubmitCreation} textButton="SAVE CHANGES" />
                </SafeAreaView>
            </View>
        </View>
    )
}

export default InspectionEditScreen;