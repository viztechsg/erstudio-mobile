import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Button, SafeAreaView, Alert, TouchableOpacity, Image } from 'react-native';
import TextField from '../../../components/TextField';
import SelectPicker from '../../../components/SelectPicker';
import LongText from '../../../components/LongText';
import DefaultButton from '../../../components/DefaultButton';

import InspectionRadioGroup from '../../../components/Project/InspectionRadioGroup';
import Icon from 'react-native-vector-icons/AntDesign';
import InspectionRemarkItem from '../../../components/Project/InspectionRemarkItem';
import { getSoiSource, getSowSource, getVendorSource } from '../../../services/config';
import { Overlay } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { FlatList } from 'react-native-gesture-handler';
import moment from 'moment';
import { addProjectInspection } from '../../../services/projectInspection';
import { Platform } from 'react-native';

const InspectionCreateScreen = ({ props, navigation }) => {
    const { project_id } = navigation.state.params;
    const [sowOptions, setSowOptions] = useState([]);
    const [soiList, setSoiList] = useState([]);
    const [checklists, setChecklists] = useState([]);
    const [vendorOptions, setVendorOptions] = useState([]);
    const [vendorModalOptions, setVendorModalOptions] = useState([]);
    const [visible, setVisible] = useState(false);
    const [remarkVisible, setRemarkVisible] = useState(false);
    const statusList = [
        {
            label: "Pending",
            value: "pending",
            key: 1
        },
        {
            label: "Passed",
            value: "passed",
            key: 2
        },
        {
            label: "Failed",
            value: "failed",
            key: 3
        },
    ];

    // DATA
    const [soiId, setSoiId] = useState("");
    const [sowId, setSowId] = useState("");
    const [vendorId, setVendorId] = useState("");
    const [status, setStatus] = useState("");
    const [images, setImages] = useState([]);
    const [remarks, setRemarks] = useState([]);

    // REMARK FIELD
    const [modalRemark, setRemarkModal] = useState("");
    const [modalVendors, setModalVendors] = useState([]);
    const [tempVendor, setTempVendor] = useState("");

    useEffect(() => {
        getSowSource().then((data) => {
            setSowOptions([]);
            data.data.map((value) => {
                setSowOptions((oldValue) => [
                    ...oldValue,
                    { label: value.name, value: value.id, key: value.name },
                ]);
            });
        });
        getSoiSource().then((data) => {
            setSoiList([]);
            data.data.map((value) => {
                setSoiList((oldValue) => [
                    ...oldValue,
                    { label: value.name, value: value.id, key: value.name, checklists: value.checklists },
                ]);
            });
        });
        getVendorSource().then((data) => {
            setVendorOptions([]);
            setVendorModalOptions([]);
            data.data.map((value) => {
                setVendorOptions((oldValue) => [
                    ...oldValue,
                    { label: value.name, value: value.id, key: value.name },
                ]);
                setVendorModalOptions((oldValue) => [
                    ...oldValue,
                    { label: value.name, value: value.name, key: value.name },
                ]);
            });
        });
    }, [project_id]);

    const onSubmitCreation = () => {
        let payload = {
            vendor_id: vendorId,
            scope_of_work_id: sowId,
            scope_of_inspection_id: soiId,
            inspection_list: checklists,
            status: status,
            project_id: project_id,
            remarks: remarks,
            images: images,
        }
        addProjectInspection(payload).then(Alert.alert('Success', 'Inspection added'));

    }

    const toggleOverlay = () => {
        setVisible(!visible);
    }

    const toggleRemark = () => {
        setRemarkVisible(!remarkVisible);
        setModalVendors([]);
        setTempVendor("");
        setRemarkModal("");
    }

    const getSelectedSoiChecklist = (soi_id) => {
        var soiChecklist = soiList.filter((item) => {
            return item.id = soi_id;
        });

        setChecklists([]);
        if (soiChecklist[0].checklists.length > 0) {
            soiChecklist[0].checklists.map((value) => {
                setChecklists((oldValue) => [
                    ...oldValue,
                    {
                        description: value.description,
                        value: "NAN"
                    }
                ]);
            });
        }

    }

    const addRemark = () => {
        let payload = {
            vendor_id: vendorId,
            remark: modalRemark,
            vendors: modalVendors,
            status: status
        }

        setRemarks((oldValue) => [
            ...oldValue,
            payload
        ]);

        toggleRemark();
    }

    const pickImage = async () => {
        const options = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 0.1,
            exif: true,
            // base64: true
        }

        var result = await ImagePicker.launchImageLibraryAsync(options);

        const base64 = await FileSystem.readAsStringAsync(result.uri, { encoding: 'base64' });

        if (!result.cancelled) {

            var captureOn = moment().format('YYYY-MM-DD');
            if (result.exif['DateTime'] != undefined) {
                var strDate = result.exif['DateTime'].split(" ");
                captureOn = strDate[0].split(":").join("-");
            }

            setImages((oldData) => [
                ...oldData,
                {
                    image: 'data:image/png;base64,' + base64,
                    capture_time: captureOn
                }
            ]);
        }

        if(Platform.OS != "ios")
        {
            toggleOverlay();
        }
    };

    const captureImage = async () => {
        const options = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 0.1,
            exif: true,
            // base64: true
        }

        var result = await ImagePicker.launchCameraAsync(options);
        const base64 = await FileSystem.readAsStringAsync(result.uri, { encoding: 'base64' });

        if (!result.cancelled) {

            var captureOn = moment().format('YYYY-MM-DD');
            if (result.exif['DateTime'] != undefined) {
                var strDate = result.exif['DateTime'].split(" ");
                captureOn = strDate[0].split(":").join("-");
            }

            setImages((oldData) => [
                ...oldData,
                {
                    image: 'data:image/png;base64,' + base64,
                    capture_time: captureOn
                }
            ]);
        }
        if(Platform.OS != "ios")
        {
            toggleOverlay();
        }
        
    };




    const renderInspectionList = (inspectionList) => {
        return inspectionList.map((item, index) => {
            return (
                <View style={{ marginTop: 15 }}>
                    <Text>{item.description}</Text>
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
                        <InspectionRadioGroup key={item.id} value={item.value} onViewPress={(data) => {
                            let questions = [...checklists];
                            let question = { ...questions[index] };
                            question.value = data;

                            questions[index] = question;
                            setChecklists(questions);
                        }} />
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
            {/* Pick image */}

            <Overlay
                isVisible={visible}
                onBackdropPress={toggleOverlay}
                overlayStyle={{ width: '80%' }}
            >
                <SafeAreaView>
                    <Text style={{ fontSize: 20, color: 'grey' }}>Select Image</Text>
                    <DefaultButton textButton="Browse" onPress={pickImage} />
                    <DefaultButton textButton="Capture" onPress={captureImage} />
                </SafeAreaView>
            </Overlay>

            {/* TOGGLE REMARK */}
            <Overlay
                isVisible={remarkVisible}
                onBackdropPress={toggleRemark}
                overlayStyle={{ width: '80%' }}
            >
                <SafeAreaView>
                    <Text style={{ fontSize: 20, color: 'grey' }}>Inspection Remark</Text>
                    <LongText label="Remark" required={true} onChange={(data) => setRemarkModal(data)} />
                    <SelectPicker label="Vendor" required={true} options={vendorModalOptions} selectedValue={tempVendor} onSelect={(data) => {
                        setTempVendor("");
                        setModalVendors((oldValue) => [
                            ...oldValue,
                            data
                        ]);
                    }} />
                    {
                        modalVendors.map((v, i) => {
                            return (
                                <View style={{ padding: 5, borderRadius: 5, backgroundColor: '#ececf5', marginTop: 5, height: 40, justifyContent: 'center' }}>
                                    <Text>{v}</Text>
                                </View>
                            )
                        })
                    }
                    <DefaultButton textButton="ADD" onPress={() => addRemark()} />
                </SafeAreaView>
            </Overlay>
            <View>
                <Text style={{ fontSize: 20 }}>Add Inspection</Text>
                <Text style={{ fontSize: 14, color: 'red' }}>*Required fields</Text>
            </View>
            <View style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <SelectPicker label="Scope of inspection" required={true} options={soiList} selectedValue={soiId} onSelect={(data) => { setSoiId(data); getSelectedSoiChecklist(data) }} />
                    <SelectPicker label="Scope of work" required={true} options={sowOptions} selectedValue={sowId} onSelect={(data) => setSowId(data)} />
                    <SelectPicker label="Vendor" required={true} options={vendorOptions} selectedValue={vendorId} onSelect={(data) => setVendorId(data)} />
                    <Text style={{ marginTop: 20 }}>Inspection List</Text>
                    {renderInspectionList(checklists)}
                    <SelectPicker label="Inspection Result" required={true} options={statusList} selectedValue={status} onSelect={(data) => setStatus(data)} />
                    <Text style={{ marginTop: 20 }}>Add photos</Text>

                    {/* PHOTO SECTION */}
                    <View style={{ marginTop: 10, backgroundColor: 'white', height: 160, padding: 10, flexDirection: 'row' }}>
                        {
                            (Platform.OS != "ios") &&
                            <TouchableOpacity onPress={toggleOverlay} style={{ marginRight: 5 }}>
                                <View style={{ height: 140, width: 150, borderColor: 'grey', borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon name="pluscircleo" size={60} color="grey" />
                                </View>
                            </TouchableOpacity>
                        }

                        {
                            (Platform.OS == "ios") &&
                            (
                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <TouchableOpacity onPress={pickImage}>
                                        <View style={{ height: 50, width: 150, borderColor: 'grey', borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginBottom: 5 }}>
                                            <Text>Browse</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={captureImage}>
                                        <View style={{ height: 50, width: 150, borderColor: 'grey', borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center' }}>
                                            <Text>Capture</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        }

                        <FlatList
                            horizontal
                            showsHorizontalScrollIndicator
                            data={images}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <View style={{ width: 140, height: 130, marginHorizontal: 2 }}>
                                    <Image source={{ uri: item.image }} style={{ width: '100%', height: 140, borderRadius: 10, resizeMode: 'stretch' }} />
                                </View>

                            )}
                        />
                    </View>
                    {/* REMARK SECTION */}
                    <Text style={{ marginTop: 20 }}>Remarks</Text>
                    <FlatList
                        data={remarks}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <InspectionRemarkItem item={item} onViewPress={() => console.log('PRESSED')} />
                        )}
                    />
                    <TouchableOpacity onPress={toggleRemark}>
                        <View style={{ backgroundColor: 'white', justifyContent: 'center', height: 45, marginTop: 5, paddingHorizontal: 20, flexDirection: 'row', marginBottom: 20 }}>
                            <View style={{ width: '50%', justifyContent: 'center' }}>
                                <Text style={{ color: 'black' }}>Add new remark</Text>
                            </View>

                            <View style={{ width: '50%', alignItems: 'flex-end', justifyContent: 'center' }}>
                                <Icon name="plus" size={30} color="black" />
                            </View>

                        </View>
                    </TouchableOpacity>
                </ScrollView>
                <SafeAreaView>
                    <DefaultButton onPress={() => onSubmitCreation()} textButton="SAVE CHANGES" />
                </SafeAreaView>
            </View>
        </View>
    )
}

export default InspectionCreateScreen;