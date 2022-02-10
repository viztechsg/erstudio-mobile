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
    FlatList,
    Platform,
} from 'react-native';
import TextField from '../../../components/TextField';
import SelectPicker from '../../../components/SelectPicker';
import LongText from '../../../components/LongText';
import DefaultButton from '../../../components/DefaultButton';
import ImageField from '../../../components/ImageField';
import InspectionRadioGroup from '../../../components/Project/InspectionRadioGroup';
import Icon from 'react-native-vector-icons/AntDesign';
import InspectionRemarkItem from '../../../components/Project/InspectionRemarkItem';
import DefectRemarkItem from '../../../components/Project/DefectRemarkItem';
import {
    getAreaSource,
    getSowSource,
    getVendorSource,
} from '../../../services/config';
import { addPDImage, addPDRemark, addProjectDefect, deletePDImage, getProjectDefectList, getProjectVendorList, getVendorByProject, updateProjectDefect } from '../../../services/projectDefect';
import { Overlay } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Image } from 'react-native';
import moment from 'moment';
import { getSingleProjectDefect } from '../../../services/projectDefect';
import DatePicker from '../../../components/DatePicker';
import { useCallback } from 'react';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const DefectEditScreen = ({ props, navigation }) => {
    const { defect_id, defect, project } = navigation.state.params;
    const [defectData, setDefectData] = useState([]);
    const [beforeImages, setBeforeImages] = useState([]);
    const [afterImages, setAfterImages] = useState([]);

    const [sowOptions, setSowOptions] = useState([]);
    const [areaOptions, setAreaOptions] = useState([]);
    const [vendorOptions, setVendorOptions] = useState([]);
    const [vendorModalOptions, setVendorModalOptions] = useState([]);
    const [remarkVisible, setRemarkVisible] = useState(false);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [type, setType] = useState('');
    const [visible, setVisible] = useState(false);
    const [tempImages, setTempImages] = useState([]);
    const [completeDate, setCompleteDate] = useState(null);
    const [tempCompleteDate, setTempCompleteDate] = useState(null);
    const categoryOptions = [
        {
            label: 'Pre-renovation',
            value: 'Pre-renovation',
            key: 1,
        },
        {
            label: 'Defect',
            value: 'Defect',
            key: 2,
        },
        {
            label: 'Handover',
            value: 'Handover',
            key: 3,
        },
    ];

    const statusOptions = [
        {
            label: 'Active',
            value: 'Active',
            key: 1,
        },
        {
            label: 'Inactive',
            value: 'Inactive',
            key: 2,
        },
    ];

    // DATA
    const [imageId, setImageId] = useState('');
    // REMARK FIELD
    const [modalRemark, setRemarkModal] = useState('');
    const [modalVendors, setModalVendors] = useState([]);
    const [tempVendor, setTempVendor] = useState('');

    const initData = () => {
        getSingleProjectDefect(defect_id).then((data) => {
            setDefectData(data);
            const beforeImages = data.images?.filter((i) => i.type == 'BEFORE');
            setBeforeImages(beforeImages);

            const afterImages = data.images?.filter((i) => i.type == 'AFTER');
            setAfterImages(afterImages);
        });
    }

    useEffect(() => {
        initData();
    }, [defect_id]);

    useEffect(() => {
        getAreaSource().then((data) => {
            setAreaOptions([]);
            data.data.map((value) => {
                setAreaOptions((oldValue) => [
                    ...oldValue,
                    { label: value.name, value: value.name, key: value.name },
                ]);
            });
        });
        getSowSource().then((data) => {
            setSowOptions([]);
            data.data.map((value) => {
                setSowOptions((oldValue) => [
                    ...oldValue,
                    { label: value.name, value: value.id, key: value.name },
                ]);
            });
        });
        getProjectVendorList(defect.project_id, defect.scope_of_work_id).then((data) => {
            setVendorOptions([]);
            data.map((value) => {
                if (value.vendor_id != null) {
                    setVendorOptions((oldValue) => [
                        ...oldValue,
                        { label: value.vendor.name, value: value.vendor.id, key: value.vendor.name },
                    ]);
                }

            });
        });

        getVendorByProject(defect.project_id).then((data) => {
            setVendorModalOptions([]);
            data.map((value) => {
                setVendorModalOptions((oldValue) => [
                    ...oldValue,
                    { label: value.vendor ? value.vendor.name : value.vendor_name, value: value.vendor ? value.vendor.name : value.vendor_name, key: value.vendor ? value.vendor.name : value.vendor_name },
                ]);
            });
        });

    }, [defect_id]);

    const pickImage = async (tp) => {
        var _type = tp ? tp : type;
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

            let payload = {
                image: 'data:image/png;base64,' + base64,
                capture_time: captureOn,
                type : _type
            }

            if (_type == "BEFORE") {
                setBeforeImages((oldData) => [
                    ...oldData,
                    payload
                ]);
            }

            if (_type == "AFTER") {
                setAfterImages((oldData) => [
                    ...oldData,
                    payload
                ]);
            }
            addPDImage(payload, defect_id).then((data) => Alert.alert("Success", data)).then(() => {
                if(Platform.OS != "ios")
                {
                    toggleOverlay();
                    setType("");
                }
                initData();
            });
        }
    };

    const captureImage = async (tp) => {
        var _type = tp ? tp : type;
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

            let payload = {
                image: 'data:image/png;base64,' + base64,
                capture_time: captureOn,
                type: _type
            }

            if (_type == "BEFORE") {
                setBeforeImages((oldData) => [
                    ...oldData,
                    payload
                ]);
            }

            if (_type == "AFTER") {
                setAfterImages((oldData) => [
                    ...oldData,
                    payload
                ]);
            }
            addPDImage(payload, defect_id).then((data) => Alert.alert("Success", data)).then(() => {
                if(Platform.OS != "ios")
                {
                    toggleOverlay();
                    setType("");
                }
                initData();
            });
        }
    };

    const confirmImage = () => {
        setImageModalVisible(!imageModalVisible);
    };

    const toggleOverlay = () => {
        setVisible(!visible);
    }

    const deleteImage = () => {
        console.log(imageId);
        deletePDImage(imageId).then((data) => {
            Alert.alert("Success", data);
        })
            .then(setImageId(""))
            .then(confirmImage());

        initData();
    }

    const addRemark = () => {
        let payload = {
            project_defect_id: defect_id,
            vendor_id: defectData.vendor_id,
            remark: modalRemark,
            vendors: modalVendors,
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

        addPDRemark(payload)
            .then(() => {
                setRemarkModal("");
                setModalVendors([]);
            }
            )
            .then(
                toggleRemark()
            );
        initData()
    };

    const toggleRemark = () => {
        setRemarkVisible(!remarkVisible);
        setModalVendors([]);
        setTempVendor('');
        setRemarkModal('');
    };

    const onSubmitCreation = (completeDate = "") => {
        let payload = {
            category: defectData.category || defect.category,
            status: defectData.status || defect.status,
            complete_date: completeDate ? completeDate : defectData.complete_date ? defectData.complete_date : defect.complete_date,
            area_id: defectData.area_id || defect.area_id,
            scope_of_work_id: defectData.scope_of_work_id || defect.scope_of_work_id,
            vendor_id: defectData.vendor_id || defect.vendor_id
        }

        updateProjectDefect(payload, defect_id).then(
            Alert.alert('Success', 'Defect updated')
        )
        .then(() => wait(1500).then(() => navigation.navigate('ProgressDefectList', { project })));
    };

    const checkModalVendorExist = (name) => {
        const found = modalVendors.some(el => el === name);

        if(found) {
            Alert.alert("Invalid Input","You have added this vendor");
            return true;
        }
        return false;
    }


    return (
        <View
            style={{
                flex: 1,
                flexDirection: 'column',
                // alignItems: 'stretch',
                padding: 20,
                backgroundColor: '#F3F3F3',
            }}>
            {/* CONFIRM DELETE IMAGE */}
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
            {/* Pick image */}
            <Overlay
                isVisible={visible}
                onBackdropPress={toggleOverlay}
                overlayStyle={{ width: '80%' }}
            >
                <SafeAreaView>
                    <Text style={{ fontSize: 20, color: 'grey' }}>Select Image</Text>
                    <DefaultButton textButton="Browse" onPress={() => pickImage("")} />
                    <DefaultButton textButton="Capture" onPress={() => captureImage("")} />
                </SafeAreaView>
            </Overlay>
            {/* TOGGLE REMARK */}
            <Overlay
                isVisible={remarkVisible}
                onBackdropPress={toggleRemark}
                overlayStyle={{ width: '80%' }}>
                <SafeAreaView>
                    <Text style={{ fontSize: 20, color: 'grey' }}>Defect Remark</Text>
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
                                setModalVendors((oldValue) => [...oldValue, data]);
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
                <Text style={{ fontSize: 20 }}>Edit Defect</Text>
                <Text style={{ fontSize: 14, color: 'red' }}>*Required fields</Text>
            </View>
            <View style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* <SelectPicker
                        label="Area"
                        required={true}
                        options={areaOptions}
                        selectedValue={defect.area_name}
                        onSelect={(data) =>
                            setDefectData((prevState) => ({ ...prevState, area_id: data }))
                        }
                        disabled={true}
                    /> */}
                    <TextField label="Area" required={true} editable={false} value={defectData.area ? defectData.area.name : defectData.area_name} />
                    <SelectPicker
                        disabled={true}
                        label="Category"
                        required={true}
                        options={categoryOptions}
                        selectedValue={defectData?.category || defect.category}
                        onSelect={(data) =>
                            setDefectData((prevState) => ({ ...prevState, category: data }))
                        }
                    />
                    <SelectPicker
                        label="Sow"
                        required={true}
                        disabled={true}
                        options={sowOptions}
                        selectedValue={
                            defectData?.scope_of_work_id || defect.scope_of_work_id
                        }
                        onSelect={(data) =>
                            setDefectData((prevState) => ({ ...prevState, scope_of_work_id: data }))
                        }
                    />
                    {/* <SelectPicker
                        label="Vendor"
                        required={true}
                        options={vendorOptions}
                        selectedValue={defectData?.vendor_id || defect.vendor_id}
                        onSelect={(data) =>
                            setDefectData((prevState) => ({ ...prevState, vendor_id: data }))
                        }
                    /> */}
                    <Text style={{ marginTop: 20 }}>Vendors</Text>
                    {
                        defect.vendors.map((v, i) => {
                            return (
                                <View style={{ padding: 5, borderRadius: 5, backgroundColor: '#ececf5', marginTop: 5, height: 40, justifyContent: 'center' }}>
                                    <Text style={{ color: v.is_new ? "red" : "black" }}>{v.vendor ? v.vendor.name : v.vendor_name}</Text>
                                </View>
                            )
                        })
                    }
                    <SelectPicker
                        label="Status"
                        required={true}
                        options={statusOptions}
                        selectedValue={defectData?.status || defect.status}
                        onSelect={(data) =>
                            setDefectData((prevState) => ({ ...prevState, status: data }))
                        }
                    />

                    <DatePicker
                        label="Complete Date"
                        initialDate={defectData?.complete_date ? defectData?.complete_date : defect.complete_date ? defect.complete_date : completeDate}
                        required={false}
                        onChange={(data) => {
                            setCompleteDate(data)
                            setDefectData((prevState) => ({ ...prevState, complete_date: data }));
                            onSubmitCreation(data);
                        }}
                        selectedDate={defectData?.complete_date ? defectData?.complete_date : defect.complete_date ? defect.complete_date : completeDate} />

                    <Text style={{ marginTop: 20 }}>Add Before photos</Text>

                    {/* PHOTO SECTION */}
                    <View
                        style={{
                            marginTop: 10,
                            backgroundColor: 'white',
                            height: 190,
                            padding: 10,
                            flexDirection: 'row',
                        }}>
                        {
                            (Platform.OS != "ios") &&
                            <TouchableOpacity onPress={() => { toggleOverlay(); setType("BEFORE") }}>
                                <View style={{ height: 130, width: 150, borderColor: 'grey', borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon name="pluscircleo" size={60} color="grey" />
                                </View>
                            </TouchableOpacity>
                        }

                        {
                            (Platform.OS == "ios") &&
                            (
                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <TouchableOpacity onPress={() => pickImage("BEFORE")}>
                                        <View style={{ height: 50, width: 150, borderColor: 'grey', borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginBottom: 5 }}>
                                            <Text>Browse</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => captureImage("BEFORE")}>
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
                            data={beforeImages}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <View style={{ width: 140, height: 130, marginHorizontal: 2 }}>
                                    <Image source={{ uri: item.path }} style={{ width: '100%', height: 140, borderRadius: 10, resizeMode: 'stretch' }} />
                                    <TouchableOpacity style={{ marginTop: 5 }} onPress={() => {
                                        setImageId(item.id);
                                        confirmImage();
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

                    <Text style={{ marginTop: 20 }}>Add After photos</Text>

                    {/* PHOTO SECTION */}
                    <View
                        style={{
                            marginTop: 10,
                            backgroundColor: 'white',
                            height: 190,
                            padding: 10,
                            flexDirection: 'row',
                        }}>
                        {
                            (Platform.OS != "ios") &&
                            <TouchableOpacity onPress={() => { toggleOverlay(); setType("AFTER") }}>
                                <View style={{ height: 130, width: 150, borderColor: 'grey', borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon name="pluscircleo" size={60} color="grey" />
                                </View>
                            </TouchableOpacity>
                        }

                        {
                            (Platform.OS == "ios") &&
                            (
                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <TouchableOpacity onPress={() => pickImage("AFTER")}>
                                        <View style={{ height: 50, width: 150, borderColor: 'grey', borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginBottom: 5 }}>
                                            <Text>Browse</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => captureImage("AFTER")}>
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
                            data={afterImages}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <View style={{ width: 140, height: 130, marginHorizontal: 2 }}>
                                    <Image source={{ uri: item.path }} style={{ width: '100%', height: 140, borderRadius: 10, resizeMode: 'stretch' }} />
                                    <TouchableOpacity style={{ marginTop: 5 }} onPress={() => {
                                        setImageId(item.id);
                                        confirmImage();
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
                        data={defectData.remarks}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <DefectRemarkItem item={item} designer={defectData.designer?.name} onViewPress={() => console.log('PRESSED')} />
                        )}
                    />
                    <TouchableOpacity onPress={() => toggleRemark()}>
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
                    <View style={{ marginTop: 20 }}>
                        <DefaultButton
                            onPress={() => onSubmitCreation()}
                            textButton="SAVE CHANGES"
                        />
                        {/* <DefaultButton
                            onPress={() => onSubmitCreation}
                            textButton="CLOSE CASE"
                        /> */}
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

export default DefectEditScreen;
