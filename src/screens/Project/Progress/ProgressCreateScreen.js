import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Button, SafeAreaView, Alert, TouchableOpacity, Platform, Image } from 'react-native';
import TextField from '../../../components/TextField';
import SelectPicker from '../../../components/SelectPicker';
import LongText from '../../../components/LongText';
import DefaultButton from '../../../components/DefaultButton';
import ImageField from '../../../components/ImageField';
import { Overlay } from 'react-native-elements';
//REDUX
import { createLead } from '../../../actions/leadAction';
import { useDispatch } from 'react-redux';
import { getSowSource } from '../../../services/config';
import Icon from 'react-native-vector-icons/AntDesign';
import { FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { addProjectProgress } from '../../../services/project';
import DatePicker from '../../../components/DatePicker';
import moment from 'moment';
const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
};

const ProgressCreateScreen = ({ props, navigation }) => {
    const { categoryName, area_id, project_id } = navigation.state.params;
    const [areaId, setAreaId] = useState(area_id);
    const [scope_of_work, setSOW] = useState("");
    const [sowOptions, setSowOptions] = useState([]);
    const [images, setImages] = useState([]);
    const [remark, setRemark] = useState("");
    const areaList = [
        {
            key: categoryName,
            label: categoryName,
            value: area_id
        }
    ]
    const [firstImage, setFirstImage] = useState("");
    const [firstRemark, setFirstRemark] = useState("");
    const [firstCaptureOn, setFirstCaptureOn] = useState(null);
    const [visible, setVisible] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

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
    }, [area_id]);

    const toggleOverlay = () => {
        setVisible(!visible)
    }

    const toggleOverlay2 = () => {
        setVisible2(!visible2);
    }

    const pickImage = async (type) => {
        const options = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 0.1,
            exif: true,
            // base64: true
        }
        if (type == "camera") {
            var result = await ImagePicker.launchCameraAsync(options);
        }
        else {
            var result = await ImagePicker.launchImageLibraryAsync(options);
        }
        const base64 = await FileSystem.readAsStringAsync(result.uri, { encoding: 'base64' });
        toggleOverlay();
        if (!result.cancelled) {
            setFirstImage('data:image/png;base64,' + base64);
        }

        var strDate = result.exif['DateTime'].split(" ");
        var captureOn = strDate[0].split(":").join("-")

        setFirstCaptureOn(new Date(captureOn));

    };

    const pickImageList = async (index, type) => {
        const options = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 0.1,
            exif: true
        }

        if (type == "camera") {
            var result = await ImagePicker.launchCameraAsync(options);
        }
        else {
            var result = await ImagePicker.launchImageLibraryAsync(options);
        }

        var strDate = result.exif['DateTime'] ? result.exif['DateTime'].split(" ") : null;
        var captureOn = strDate ? strDate[0].split(":").join("-") : null;
        const base64 = await FileSystem.readAsStringAsync(result.uri, { encoding: 'base64' });

        if (!result.cancelled) {
            handleImageListCHange(index, base64, "add", captureOn);
        }

        toggleOverlay2();
    };

    const deletImageById = id => {
        const filteredData = images.filter(item => item.id !== id);
        setImages(filteredData);
    }

    const handleImageListCHange = (index, base64, type, date = null) => {
        let items = [...images];
        let item = { ...items[index] };
        if (type == "add") {
            item.image = 'data:image/png;base64,' + base64;
            item.capture_on = date ? new Date(date) : date;
        }
        else {
            item.image = "";
            item.capture_on = null;
        }
        
        items[index] = item;
        setImages(items);
    }

    const handleRemarkImageList = (index, value) => {
        let items = [...images];
        let item = { ...items[index] };
        item.remark = value;

        items[index] = item;
        setImages(items);
    }

    const handleCaptureOnImageList = (index, value) => {
        let items = [...images];
        let item = { ...items[index] };
        item.capture_on = new Date(value);

        items[index] = item;
        setImages(items);
    }

    const onSubmitCreation = () => {
        let imagePayload = {
            image: firstImage,
            remark: firstRemark,
            capture_on: firstCaptureOn
        }

        var newImagesList = [...images, imagePayload];

        let payload = {
            project_id: project_id,
            area_id: areaId,
            scope_of_work_id: scope_of_work,
            remark: remark,
            images: newImagesList
        }

        addProjectProgress(payload).then(() => wait(1500).then(() =>  navigation.push('ProjectProgressPhoto', {
            categoryName: categoryName, area_id: area_id, project_id: project_id
        })));
    }

    return (
        <View style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'stretch',
            padding: 20,
            backgroundColor: '#F3F3F3',
        }}>
            {/* Modal first image */}
            <Overlay
                isVisible={visible}
                onBackdropPress={toggleOverlay}
                overlayStyle={{ width: '80%' }}
            >
                <SafeAreaView>
                    <Text style={{ fontSize: 20, color: 'grey' }}>Select Image</Text>
                    <DefaultButton textButton="Browse" onPress={() => pickImage("browse")} />
                    <DefaultButton textButton="Capture" onPress={() => pickImage("camera")} />
                </SafeAreaView>
            </Overlay>

            {/* Modal images list */}
            <Overlay
                isVisible={visible2}
                onBackdropPress={toggleOverlay2}
                overlayStyle={{ width: '80%' }}
            >
                <SafeAreaView>
                    <Text style={{ fontSize: 20, color: 'grey' }}>Select Image</Text>
                    <DefaultButton textButton="Browse" onPress={() => pickImageList(currentIndex, "browse")} />
                    <DefaultButton textButton="Capture" onPress={() => pickImageList(currentIndex, "camera")} />
                </SafeAreaView>
            </Overlay>
            <View>
                <Text style={{ fontSize: 20 }}>Add Project Progress</Text>
                <Text style={{ fontSize: 14, color: 'red' }}>*Required fields</Text>
            </View>
            <View style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false}>

                    <SelectPicker
                        label="Area"
                        disabled={true}
                        required={true}
                        selectedValue={areaId}
                        onSelect={area => setAreaId(area)}
                        options={areaList}
                    />
                    <SelectPicker
                        label="Scope of Work"
                        required={true}
                        selectedValue={scope_of_work}
                        onSelect={sow => setSOW(sow)}
                        options={sowOptions}
                    />
                    <View style={{ borderColor: 'black', borderWidth: 1, paddingHorizontal: 10, paddingBottom: 10, marginVertical: 20, borderRadius: 5 }}>
                        <View style={{ flexDirection: 'row', marginBottom: 5, marginTop: 20 }}>
                            <Text>Progress Photo</Text>
                            <Text style={{ color: 'red' }}>*</Text>
                        </View>
                        {(firstImage != "") && <Image source={{ uri: firstImage }} style={{ width: '100%', height: 300, borderRadius: 5, resizeMode: 'contain' }} />}

                        {
                            (firstImage == "") && <ImageField required={false} onPress={toggleOverlay} />
                        }

                        {
                            (firstImage != "") &&
                            (
                                <View style={{ justifyContent: "space-around", flexDirection: "row", marginTop: 10 }}>
                                    <View style={{ width: '49%' }}>
                                        <TouchableOpacity onPress={toggleOverlay}>
                                            <View style={{ height: 50, borderColor: 'grey', borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center' }}>
                                                <Text>Retake</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ width: '49%' }}>
                                        <TouchableOpacity onPress={() => {
                                            setFirstImage("");
                                        }
                                        }>
                                            <View style={{ height: 50, borderColor: 'grey', borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center' }}>
                                                <Text>Delete</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        }

                        {
                            (firstImage != "" && firstCaptureOn != null) && (
                                <DatePicker
                                    label="Capture On"
                                    initialDate={firstCaptureOn}
                                    required={false}
                                    onChange={(data) => setFirstCaptureOn(data)}
                                    selectedDate={firstCaptureOn} />
                            )
                        }

                        {
                            (firstImage != "" && firstCaptureOn == null) &&
                            <DatePicker
                                label="Capture On"
                                initialDate={firstCaptureOn}
                                required={false}
                                onChange={(data) => setFirstCaptureOn(data)}
                                selectedDate={firstCaptureOn} />
                        }


                        <LongText label="Comments" required={false} value={firstRemark} onChange={(data) => setFirstRemark(data)} />
                    </View>
                    <FlatList
                        data={images}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <View style={{ borderColor: 'black', borderWidth: 1, paddingHorizontal: 10, paddingBottom: 10, marginVertical: 20, borderRadius: 5 }}>
                                <View style={{ flexDirection: 'row', marginBottom: 5, marginTop: 20 }}>
                                    <Text>Progress Photo</Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </View>
                                {(item.image != "") && <Image source={{ uri: item.image }} style={{ width: '100%', height: 300, borderRadius: 5, resizeMode: 'contain' }} />}

                                {
                                    (item.image == "") && <ImageField required={false} onPress={() => { toggleOverlay2(); setCurrentIndex(index) }} />
                                }

                                {
                                    (item.image != "") &&
                                    (
                                        <View style={{ justifyContent: "space-around", flexDirection: "row", marginTop: 10 }}>
                                            <View style={{ width: '49%' }}>
                                                <TouchableOpacity onPress={() => { toggleOverlay2(); setCurrentIndex(index) }}>
                                                    <View style={{ height: 50, borderColor: 'grey', borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center' }}>
                                                        <Text>Retake</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ width: '49%' }}>
                                                <TouchableOpacity onPress={() => {
                                                    handleImageListCHange(index, null, "delete")
                                                }
                                                }>
                                                    <View style={{ height: 50, borderColor: 'grey', borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center' }}>
                                                        <Text>Delete</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )
                                }

                                {
                                    (item.image != "" && item.capture_on != null) && (
                                        <DatePicker
                                            label={`Capture on`}
                                            initialDate={item.capture_on}
                                            required={false}
                                            onChange={(data) => handleCaptureOnImageList(index, data)}
                                            selectedDate={item.capture_on}
                                        />
                                    )
                                }

                                {
                                    (item.image != "" && item.capture_on == null) && (
                                        <DatePicker
                                            label="Capture On"
                                            initialDate={item.capture_on}
                                            required={false}
                                            onChange={(data) => handleCaptureOnImageList(index, data)}
                                            selectedDate={item.capture_on}
                                        />
                                    )
                                }

                                <LongText label="Comments" required={false} value={item.remark} onChange={(data) => handleRemarkImageList(index, data)} />
                                <TouchableOpacity style={{ marginTop: 5 }} onPress={() => deletImageById(item.id)
                                }>
                                    <View style={{ height: 50, borderColor: 'red', borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center' }}>
                                        <Icon name="minuscircleo" size={40} color="red" />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                    <View style={{ marginTop: 10 }}>
                        <TouchableOpacity onPress={() => {
                            setImages((oldValue) => [
                                ...oldValue,
                                {
                                    id: images.length + 1,
                                    image: "",
                                    remark: "",
                                    capture_on: null
                                },
                            ]);
                        }

                        }>
                            <View style={{ height: 50, borderColor: 'grey', borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center' }}>
                                <Icon name="pluscircleo" size={40} color="grey" />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <LongText label="Remarks" required={false} value={remark} onChange={(data) => setRemark(data)} />
                </ScrollView>
                <SafeAreaView>
                    <DefaultButton onPress={onSubmitCreation} textButton="UPDATE PROGRESS" />
                </SafeAreaView>
            </View>
        </View>
    )
}

export default ProgressCreateScreen;