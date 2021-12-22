import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Button, SafeAreaView, Alert, TouchableOpacity, FlatList } from 'react-native';
import TextField from '../../../components/TextField';
import SelectPicker from '../../../components/SelectPicker';
import LongText from '../../../components/LongText';
import DefaultButton from '../../../components/DefaultButton';
import ImageField from '../../../components/ImageField';
import InspectionRadioGroup from '../../../components/Project/InspectionRadioGroup';
import Icon from 'react-native-vector-icons/AntDesign';
import InspectionRemarkItem from '../../../components/Project/InspectionRemarkItem';
import DefectRemarkItem from '../../../components/Project/DefectRemarkItem';
import { getAreaSource, getSowSource, getVendorSource } from '../../../services/config';
import { addProjectDefect, addProjectVendorList, getProjectVendorList } from '../../../services/projectDefect';
import { Overlay } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Image } from 'react-native';
import moment from 'moment';
import LoadingState from '../../../components/LoadingState';
import { Platform } from 'react-native';
const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
};

const DefectCreationScreen = ({ props, navigation }) => {

    const { project_id, project } = navigation.state.params;
    const [sowOptions, setSowOptions] = useState([]);
    const [areaOptions, setAreaOptions] = useState([]);
    const [vendorOptions, setVendorOptions] = useState([]);
    const [vendorModalOptions, setVendorModalOptions] = useState([]);
    const [remarkVisible, setRemarkVisible] = useState(false);
    const [type, setType] = useState("");
    const [visible, setVisible] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const categoryOptions = [
        {
            label: "Pre-renovation",
            value: "Pre-renovation",
            key: 1
        },
        {
            label: "Defect",
            value: "Defect",
            key: 2
        },
        {
            label: "Handover",
            value: "Handover",
            key: 3
        },
    ];

    const statusOptions = [
        {
            label: "Active",
            value: "Active",
            key: 1
        },
        {
            label: "Inactive",
            value: "Inactive",
            key: 2
        }
    ];

    // DATA
    const [areaId, setAreaId] = useState("");
    const [vendorId, setVendorId] = useState("");
    const [sowId, setSowId] = useState("");
    const [category, setCategory] = useState("Pre-renovation");
    const [status, setStatus] = useState("Active");
    const [completeDate, setCompleteDate] = useState("");
    const [tempCompleteDate, setTempCompleteDate] = useState("");
    const [remarks, setRemarks] = useState([]);
    const [images, setImages] = useState([]);
    const [beforeImages, setBeforeImages] = useState([]);
    const [afterImages, setAfterImages] = useState([]);

    // REMARK FIELD
    const [modalRemark, setRemarkModal] = useState("");
    const [modalVendors, setModalVendors] = useState([]);
    const [tempVendor, setTempVendor] = useState("");

    // FREE VENDOR
    const [freeVendor, setFreeVendor] = useState("");
    const [vendors, setVendors] = useState([]);

    const [freeArea, setFreeArea] = useState("");

    const initVendor = () => {
        if (sowId != "") {
            getProjectVendorList(project_id, sowId).then((data) => {
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
        getAreaSource().then((data) => {
            setAreaOptions([]);
            data.data.map((value) => {
                setAreaOptions((oldValue) => [
                    ...oldValue,
                    { label: value.name, value: value.id, key: value.name },
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
        getVendorSource().then((data) => {
            setVendorModalOptions([]);
            data.data.map((value) => {
                setVendorModalOptions((oldValue) => [
                    ...oldValue,
                    { label: value.name, value: value.name, key: value.name },
                ]);
            });
        });
    }, [project_id]);

    const onSubmitCreation = () => {
        setIsUploading(true);
        let payload = {
            project_id: project_id,
            category,
            status,
            complete_date: completeDate,
            area_id: areaId,
            free_text_area: freeArea,
            scope_of_work_id: sowId,
            vendor_id: vendorId,
            remarks: remarks || null,
            images: images || null,
            vendors
        }
        addProjectDefect(payload).then((data) => {
            Alert.alert('Success', 'Project defect added')
            setIsUploading(false);

        })
            .then(() => {
                wait(1500).then(() => navigation.navigate('ProgressDefectList', { project }));
            })
            .catch((e) => {
                Alert.alert('Error', 'something wrong!!');
            });

    }

    const toggleRemark = () => {
        setRemarkVisible(!remarkVisible);
        setModalVendors([]);
        setTempVendor("");
        setRemarkModal("");
    }

    const addRemark = () => {
        let payload = {
            vendor_id: vendorId,
            remark: modalRemark,
            vendors: modalVendors,
        }

        setRemarks((oldValue) => [
            ...oldValue,
            payload
        ]);

        toggleRemark();
    }

    const pickImage = async (tp = "") => {
        var _type = tp || type;
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

            setImages((oldData) => [
                ...oldData,
                payload
            ]);
        }

        if (Platform.OS != "ios") {
            toggleOverlay();
            setType("");
        }
    };

    const captureImage = async (tp = "") => {
        var _type = tp || type;
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

            setImages((oldData) => [
                ...oldData,
                payload
            ]);
        }
        if (Platform.OS != "ios") {
            toggleOverlay();
            setType("");
        }

    };

    const toggleOverlay = () => {
        setVisible(!visible);
    }

    useEffect(() => {
        initVendor();
    }, [sowId, project_id]);

    const addNewVendor = () => {

        if (sowId == "") {
            Alert.alert("Invalid Input", "Please select scope of work");
            return;
        }

        if (freeVendor == "") {
            Alert.alert("Invalid Input", "Please specify vendor name");
            return;
        }

        setVendors((prevState) => [
            ...prevState,
            {
                id: null,
                name: freeVendor,
                vendor_name: freeVendor,
                is_new: true
            }
        ]);
        // console.log(payload)
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
            <LoadingState content="Please wait.." isUploading={isUploading} />

            {/* TOGGLE REMARK */}
            <Overlay
                isVisible={remarkVisible}
                onBackdropPress={toggleRemark}
                overlayStyle={{ width: '80%' }}
            >
                <SafeAreaView>
                    <Text style={{ fontSize: 20, color: 'grey' }}>Defect Remark</Text>
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
                <Text style={{ fontSize: 20 }}>Add New Defect</Text>
                <Text style={{ fontSize: 14, color: 'red' }}>*Required fields</Text>
            </View>
            <View style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <SelectPicker label="Area" required={true} options={areaOptions} onSelect={(data) => setAreaId(data)} />
                    <View style={{ alignItems: 'center', marginTop: 10 }}><Text>--OR--</Text></View>
                    <TextField placeholder="Area name" onChange={data => setFreeArea(data)} />
                    <SelectPicker label="Category" required={true} options={categoryOptions} selectedValue={category} onSelect={(data) => setCategory(data)} />
                    <SelectPicker label="Sow" required={true} options={sowOptions} onSelect={(data) => setSowId(data)} />
                    <SelectPicker label="Vendor" required={true} options={vendorOptions} onSelect={(data, index) => {
                        setVendorId(data);
                        setVendors((prevState) => [
                            ...prevState,
                            {
                                id: data,
                                name: vendorOptions[index - 1].label
                            }
                        ]);
                    }} />
                    <View style={{ alignItems: 'center', marginTop: 10 }}><Text>--OR--</Text></View>
                    <TextField placeholder="Vendor Name" onChange={data => setFreeVendor(data)} />
                    <View style={{
                        alignItems: 'center',
                        marginTop: 10,

                    }}>
                        <TouchableOpacity
                            key="AOSODAEUOWQUEOIU"
                            onPress={addNewVendor}
                            style={{
                                backgroundColor: 'white',
                                elevation: 1,
                                borderWidth: 1,
                                borderColor: 'gray',
                                borderRadius: 4,
                                width: '100%',
                                padding: 10,
                                alignItems: 'center'
                            }}>
                            <Text>Add Vendor</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        vendors.map((v, i) => {
                            return (
                                <View style={{ padding: 5, borderRadius: 5, backgroundColor: '#ececf5', marginTop: 5, height: 40, justifyContent: 'center' }}>
                                    <Text>{v.name}</Text>
                                </View>
                            )
                        })
                    }

                    <SelectPicker label="Status" required={true} options={statusOptions} selectedValue={status} onSelect={(data) => setStatus(data)} />

                    <Text style={{ marginTop: 20 }}>Add Before photos</Text>

                    {/* PHOTO SECTION */}
                    <View style={{ marginTop: 10, backgroundColor: 'white', height: 150, padding: 10, flexDirection: 'row' }}>
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
                                    <Image source={{ uri: item.image }} style={{ width: '100%', height: 140, borderRadius: 10, resizeMode: 'stretch' }} />
                                </View>

                            )}
                        />
                    </View>

                    <Text style={{ marginTop: 20 }}>Add After photos</Text>

                    {/* PHOTO SECTION */}
                    <View style={{ marginTop: 10, backgroundColor: 'white', height: 150, padding: 10, flexDirection: 'row' }}>
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
                                    <Image source={{ uri: item.image }} style={{ width: '100%', height: 140, borderRadius: 10, resizeMode: 'stretch' }} />
                                </View>

                            )}
                        />
                    </View>

                    {/* REMARK SECTION */}
                    <Text style={{ marginTop: 20 }}>Remarks</Text>
                    <View>
                        <FlatList
                            data={remarks}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <DefectRemarkItem item={item} onViewPress={() => console.log('PRESSED')} />
                            )}
                        />
                    </View>
                    <TouchableOpacity onPress={() => toggleRemark()}>
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
                    <DefaultButton onPress={onSubmitCreation} textButton="ADD DEFECT" />
                </SafeAreaView>
            </View>
        </View>
    )
}

export default DefectCreationScreen;