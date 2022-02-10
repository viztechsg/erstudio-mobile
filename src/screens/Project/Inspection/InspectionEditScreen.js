import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    Button,
    SafeAreaView,
    Alert,
    TouchableOpacity,
    Image,
} from 'react-native';
import TextField from '../../../components/TextField';
import SelectPicker from '../../../components/SelectPicker';
import LongText from '../../../components/LongText';
import DefaultButton from '../../../components/DefaultButton';

import InspectionRadioGroup from '../../../components/Project/InspectionRadioGroup';
import Icon from 'react-native-vector-icons/AntDesign';
import InspectionRemarkItem from '../../../components/Project/InspectionRemarkItem';
import {
    getSoiSource,
    getSowSource,
    getVendorSource,
} from '../../../services/config';
import { Overlay } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { FlatList } from 'react-native-gesture-handler';
import moment from 'moment';
import {
    addPIImage,
    addPIRemark,
    addProjectInspection,
    deletePIImage,
    getSingleProjectInspection,
    updateProjectInspection,
} from '../../../services/projectInspection';
import { Platform } from 'react-native';
import { getProjectVendorList, getVendorByProject } from '../../../services/projectDefect';
const InspectionEditScreen = ({ props, navigation }) => {
    const { project_id, item } = navigation.state.params;
    const [sowOptions, setSowOptions] = useState([]);
    const [soiList, setSoiList] = useState([]);
    const [checklists, setChecklists] = useState([]);
    const [vendorOptions, setVendorOptions] = useState([]);
    const [vendorModalOptions, setVendorModalOptions] = useState([]);
    const [visible, setVisible] = useState(false);
    const [remarkVisible, setRemarkVisible] = useState(false);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [PIData, setPIData] = useState([]);
    const statusList = [
        {
            label: 'Pending',
            value: 'pending',
            key: 1,
        },
        {
            label: 'Passed',
            value: 'passed',
            key: 2,
        },
        {
            label: 'Failed',
            value: 'failed',
            key: 3,
        },
    ];

    // DATA
    const [soiId, setSoiId] = useState('');
    const [imageId, setImageId] = useState("");

    //TEMP DATA
    const [tempImages, setTempImages] = useState([]);
    const [tempRemark, setTempRemark] = useState([]);

    // REMARK FIELD
    const [modalRemark, setRemarkModal] = useState('');
    const [modalVendors, setModalVendors] = useState([]);
    const [tempVendor, setTempVendor] = useState('');

    const initVendor = () => {
        if (PIData?.scope_of_work_id != "" || item.scope_of_work_id != "") {
            getProjectVendorList(project_id, PIData?.scope_of_work_id || item.scope_of_work_id).then((data) => {
                setVendorOptions([]);
                data.map((value) => {
                    if (value.vendor_id != null) {
                        setVendorOptions((oldValue) => [
                            ...oldValue,
                            { label: value.vendor.name, value: value.vendor.id, key: value.vendor.name },
                        ]);
                    }
                });
            })
        }
        else {
            setVendorOptions([]);
        }
    }

    useEffect(() => {
        initVendor();
    },[PIData?.scope_of_work_id,project_id]);

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
                    {
                        label: value.name,
                        value: value.id,
                        key: value.name,
                        checklists: value.checklists,
                    },
                ]);
            });
        });

        // getVendorSource().then((data) => {
        //     setVendorOptions([]);
        //     data.data.map((value) => {
        //         setVendorOptions((oldValue) => [
        //             ...oldValue,
        //             { label: value.name, value: value.id, key: value.name },
        //         ]);
        //     });
        // });
        getVendorByProject(project_id).then((data) => {
            setVendorModalOptions([]);
            data.map((value) => {
                setVendorModalOptions((oldValue) => [
                    ...oldValue,
                    { label: value.vendor ? value.vendor.name : value.vendor_name, value: value.vendor ? value.vendor.name : value.vendor_name, key: value.vendor ? value.vendor.name : value.vendor_name },
                ]);
            });
        });
    }, [project_id]);

    useEffect(() => {
        getSingleProjectInspection(item.id)
            .then((data) => setPIData(data))
            .then(console.log(PIData));
    }, [item.id, tempImages, tempRemark]);

    const onSubmitCreation = () => {
        let payload = {
            vendor_id: PIData.vendor_id || item.vendor_id,
            scope_of_work_id: PIData.scope_of_work_id || item.scope_of_work_id,
            scope_of_inspection_id: PIData.scope_of_inspection_id || item.scope_of_inspection_id,
            inspection_list: PIData.inspection_list,
            status: PIData.status || item.status,
        };
        updateProjectInspection(payload, item.id).then(
            Alert.alert('Success', 'Inspection updated')
        );
    };

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    const confirmImage = () => {
        setImageModalVisible(!imageModalVisible);
    };

    const toggleRemark = () => {
        setRemarkVisible(!remarkVisible);
        setModalVendors([]);
        setTempVendor('');
        setRemarkModal('');
    };

    const getSelectedSoiChecklist = (soi_id) => {
        var soiChecklist = soiList.filter((item) => {
            return (item.id = soi_id);
        });

        setChecklists([]);
        if (soiChecklist[0].checklists.length > 0) {
            soiChecklist[0].checklists.map((value) => {
                setChecklists((oldValue) => [
                    ...oldValue,
                    {
                        description: value.description,
                        value: 'NAN',
                    },
                ]);
            });
        }
    };

    const addRemark = () => {
        let payload = {
            project_inspection_id: item.id,
            vendor_id: PIData.vendor_id,
            remark: modalRemark,
            vendors: modalVendors,
            status: PIData.status,
        };

        if(modalRemark == "")
        {

            Alert.alert("Invalid Input","Please type the remark");
            return;
        }

        if(modalVendors.length < 1)
        {
            Alert.alert("Invalid Input","Please select at least 1 vendor");
            return;
        }

        addPIRemark(payload)
            .then(() => {
                setRemarkModal("");
                setModalVendors([]);
            }
            )
            .then(
                setTempRemark((prevState) => [
                    ...prevState,
                    payload
                ])
            )
            .then(toggleRemark());
    };

    
    const checkModalVendorExist = (name) => {
        const found = modalVendors.some(el => el === name);

        if(found) {
            Alert.alert("Invalid Input","You have added this vendor");
            return true;
        }
        return false;
    }

    const pickImage = async () => {
        const options = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 0.1,
            exif: true,
            // base64: true
        };

        var result = await ImagePicker.launchImageLibraryAsync(options);

        const base64 = await FileSystem.readAsStringAsync(result.uri, {
            encoding: 'base64'
        });

        if (!result.cancelled) {
            var captureOn = moment().format('YYYY-MM-DD');
            if (result.exif['DateTime'] != undefined) {
                var strDate = result.exif['DateTime'].split(' ');
                captureOn = strDate[0].split(':').join('-');
            }

            let payload = {
                image: 'data:image/png;base64,' + base64,
                capture_time: captureOn
            }
            addPIImage(payload, item.id).then((data) => Alert.alert("Success", data)).then(setTempImages((prevState) => [...prevState, payload]));
        }

        if (Platform.OS != "ios") {
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
        };

        var result = await ImagePicker.launchCameraAsync(options);
        const base64 = await FileSystem.readAsStringAsync(result.uri, {
            encoding: 'base64'
        });

        if (!result.cancelled) {
            var captureOn = moment().format('YYYY-MM-DD');
            if (result.exif['DateTime'] != undefined) {
                var strDate = result.exif['DateTime'].split(' ');
                captureOn = strDate[0].split(':').join('-');
            }

            let payload = {
                image: 'data:image/png;base64,' + base64,
                capture_time: captureOn
            }
            addPIImage(payload, item.id).then((data) => Alert.alert("Success", data)).then(setTempImages((prevState) => [...prevState, payload]));
        }

        if (Platform.OS != "ios") {
            toggleOverlay();
        }
    };

    const deleteImage = () => {
        console.log(imageId);
        deletePIImage(imageId).then((data) => {
            Alert.alert("Success", data);
        })
            .then(setImageId(""))
            .then(confirmImage());
    }

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
                            justifyContent: 'center',
                        }}>
                        <InspectionRadioGroup
                            key={item.id}
                            value={item.value}
                            onViewPress={(data) => {
                                let questions = [...PIData.inspection_list];
                                let question = { ...questions[index] };
                                question.value = data;

                                questions[index] = question;
                                setPIData((prevState) => ({ ...prevState, inspection_list: questions }));
                            }}
                        />
                    </View>
                </View>
            );
        });
    };

    return (
        <View
            style={{
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
                overlayStyle={{ width: '80%' }}>
                <SafeAreaView>
                    <Text style={{ fontSize: 20, color: 'grey' }}>Select Image</Text>
                    <DefaultButton
                        textButton="Browse"
                        onPress={pickImage}
                    />
                    <DefaultButton
                        textButton="Capture"
                        onPress={captureImage}
                    />
                </SafeAreaView>
            </Overlay>

            <Overlay
                isVisible={imageModalVisible}
                onBackdropPress={confirmImage}
                overlayStyle={{ width: '80%' }}>
                <SafeAreaView>
                    <Text style={{ fontSize: 20, color: 'grey' }}>Are you sure want to delete this photo?</Text>
                    <DefaultButton
                        textButton="YES"
                        onPress={() => deleteImage()}
                    />
                    <DefaultButton
                        textButton="CANCEL"
                        onPress={() => { confirmImage(); setImageId("") }}
                    />
                </SafeAreaView>
            </Overlay>

            {/* TOGGLE REMARK */}
            <Overlay
                isVisible={remarkVisible}
                onBackdropPress={toggleRemark}
                overlayStyle={{ width: '80%' }}>
                <SafeAreaView>
                    <Text style={{ fontSize: 20, color: 'grey' }}>Inspection Remark</Text>
                    <LongText
                        label="Remark"
                        required={true}
                        onChange={(data) => setRemarkModal(data)}
                    />
                    <SelectPicker
                        label="Vendor"
                        required={true}
                        options={vendorModalOptions}
                        selectedValue={tempVendor}
                        onSelect={(data) => {
                            setTempVendor('');
                            let is_exist = checkModalVendorExist(data);
                            if(is_exist == false)
                            {
                                setModalVendors((oldValue) => [
                                    ...oldValue,
                                    data
                                ]);
                            }
                            
                        }}
                    />
                    {modalVendors.map((v, i) => {
                        return (
                            <View
                                style={{
                                    padding: 5,
                                    borderRadius: 5,
                                    backgroundColor: '#ececf5',
                                    marginTop: 5,
                                    height: 40,
                                    justifyContent: 'center',
                                }}>
                                <Text>{v}</Text>
                            </View>
                        );
                    })}
                    <DefaultButton textButton="ADD" onPress={() => addRemark()} />
                </SafeAreaView>
            </Overlay>
            <View>
                <Text style={{ fontSize: 20 }}>Add Inspection</Text>
                <Text style={{ fontSize: 14, color: 'red' }}>*Required fields</Text>
            </View>
            <View style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <SelectPicker
                        label="Scope of inspection"
                        disabled={true}
                        required={true}
                        options={soiList}
                        selectedValue={
                            PIData.scope_of_inspection_id || item.scope_of_inspection_id
                        }
                        onSelect={(data) => {
                            setSoiId(data);
                            getSelectedSoiChecklist(data);
                        }}
                    />
                    <SelectPicker
                        label="Scope of work"
                        required={true}
                        options={sowOptions}
                        selectedValue={PIData.scope_of_work_id || item.scope_of_work_id}
                        onSelect={(data) =>
                            
                            setPIData((prevState) => ({ ...prevState, scope_of_work_id: data }))
                        }
                    />
                    <SelectPicker
                        label="Vendor"
                        required={true}
                        options={vendorOptions}
                        selectedValue={PIData.vendor_id || item.vendor_id}
                        onSelect={(data) =>
                            setPIData((prevState) => ({ ...prevState, vendor_id: data }))
                        }
                    />
                    <Text style={{ marginTop: 20 }}>Inspection List</Text>
                    {renderInspectionList(PIData.inspection_list || item.inspection_list)}
                    <SelectPicker
                        label="Inspection Result"
                        required={true}
                        options={statusList}
                        selectedValue={PIData.status || item.status}
                        onSelect={(data) =>
                            setPIData((prevState) => ({ ...prevState, status: data }))
                        }
                    />
                    <Text style={{ marginTop: 20 }}>Add photos</Text>

                    {/* PHOTO SECTION */}
                    <View
                        style={{
                            marginTop: 10,
                            backgroundColor: 'white',
                            height: 200,
                            padding: 10,
                            flexDirection: 'row',
                        }}>
                        {
                            (Platform.OS != "ios") &&
                            <TouchableOpacity
                                onPress={toggleOverlay}
                                style={{ marginRight: 5 }}>
                                <View
                                    style={{
                                        height: 170,
                                        width: 150,
                                        borderColor: 'grey',
                                        borderRadius: 8,
                                        borderWidth: 2,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
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
                            data={PIData.images || item.images}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <View style={{ width: 140, height: 130, marginHorizontal: 2 }}>
                                    <Image
                                        source={{ uri: item.path }}
                                        style={{
                                            width: '100%',
                                            height: 140,
                                            borderRadius: 10,
                                            resizeMode: 'stretch',
                                        }}
                                    />
                                    <TouchableOpacity style={{ marginTop: 5 }} onPress={() => {
                                        setImageId(item.id)
                                        confirmImage()
                                    }
                                    }>
                                        <View style={{ height: 25, borderColor: 'red', borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center' }}>
                                            <Icon name="minuscircleo" size={15} color="red" />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                    </View>
                    {/* REMARK SECTION */}
                    <Text style={{ marginTop: 20 }}>Remarks</Text>
                    <FlatList
                        data={PIData.remarks || item.remarks}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <InspectionRemarkItem
                                item={item}
                                designer={PIData.designer?.name || '-'}
                                onViewPress={() => console.log('PRESSED')}
                            />
                        )}
                    />
                    <TouchableOpacity onPress={toggleRemark}>
                        <View
                            style={{
                                backgroundColor: 'white',
                                justifyContent: 'center',
                                height: 45,
                                marginTop: 5,
                                paddingHorizontal: 20,
                                flexDirection: 'row',
                                marginBottom: 20,
                            }}>
                            <View style={{ width: '50%', justifyContent: 'center' }}>
                                <Text style={{ color: 'black' }}>Add new remark</Text>
                            </View>

                            <View
                                style={{
                                    width: '50%',
                                    alignItems: 'flex-end',
                                    justifyContent: 'center',
                                }}>
                                <Icon name="plus" size={30} color="black" />
                            </View>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
                <SafeAreaView>
                    <DefaultButton
                        onPress={() => onSubmitCreation()}
                        textButton="SAVE CHANGES"
                    />
                </SafeAreaView>
            </View>
        </View>
    );
};

export default InspectionEditScreen;
