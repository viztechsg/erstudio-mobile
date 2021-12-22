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
import { addProjectProgress, getProjectProgressPhoto, updateProjectProgress } from '../../../services/project';
import DatePicker from '../../../components/DatePicker';
import moment from 'moment';
const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
};
const ProgressEditScreen = ({ props, navigation }) => {
    const { item, categoryName, sow } = navigation.state.params;
    const [sowOptions, setSowOptions] = useState([]);
    const [data, setData] = useState([]);
    const [visible, setVisible] = useState(false);

    const [firstImage, setFirstImage] = useState("");
    const [firstRemark, setFirstRemark] = useState("");
    const [firstCaptureOn, setFirstCaptureOn] = useState(null);
    const [projectRemark, setProjectRemark] = useState("");

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

        getProjectProgressPhoto(item.id).then((data) => {
            setData(data.data);
        });

    }, [item.id]);

    const onSubmitCreation = () => {
        var isPathExist = data.path.includes("data:image/png;base64");
        const payload = {
            project_progress_id: data.progress?.id,
            project_progress_photo_id: item.id,
            image: isPathExist ? data.path : null,
            remark: data.progress?.comments,
            photo_remark: data.remark,
            photo_capture_on: moment(data.capture_on).format()
        }

        updateProjectProgress(payload).then(data => Alert.alert("Progress Update", "Updated")).then(wait(2000).then(navigation.navigate('ProjectProgressPhoto', {
            categoryName: categoryName, area_id: data.progress?.area_id, project_id: data.progress?.project_id
        })));

    }

    const toggleOverlay = () => {
        setVisible(!visible)
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
        if(Platform.OS != "ios")
        {
            toggleOverlay();
        }
        
        var strDate = result.exif['DateTime'].split(" ");
        var captureOn = strDate[0].split(":").join("-")
        if (!result.cancelled) {
            var img = 'data:image/png;base64,' + base64;
            setData(prevState => ({ ...prevState, path: img, capture_on: captureOn }))
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
        if(Platform.OS != "ios")
        {
            toggleOverlay();
        }
        var strDate = result.exif['DateTime'].split(" ");
        var captureOn = strDate[0].split(":").join("-")
        if (!result.cancelled) {
            var img = 'data:image/png;base64,' + base64;
            setData(prevState => ({ ...prevState, path: img, capture_on: captureOn }))
        }

    };

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
                    <DefaultButton textButton="Browse" onPress={pickImage} />
                    <DefaultButton textButton="Capture" onPress={captureImage} />
                </SafeAreaView>
            </Overlay>
            <View>
                <Text style={{ fontSize: 20 }}>Edit Project Progress</Text>
                <Text style={{ fontSize: 14, color: 'red' }}>*Required fields</Text>
            </View>
            <View style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <TextField required={true} editable={false} value={categoryName} label="Area" />
                    <TextField required={true} editable={false} value={sow} label="Sow" />
                    <View style={{ borderColor: 'black', borderWidth: 1, paddingHorizontal: 10, paddingBottom: 10, marginVertical: 20, borderRadius: 5 }}>
                        <View style={{ flexDirection: 'row', marginBottom: 5, marginTop: 20 }}>
                            <Text>Progress Photo</Text>
                            <Text style={{ color: 'red' }}>*</Text>
                        </View>
                        {(data?.path != "") && <Image source={{ uri: data?.path }} style={{ width: '100%', height: 300, borderRadius: 5, resizeMode: 'contain' }} />}

                        {
                            (data?.path == "" && Platform.OS != "ios") && <ImageField required={false} onPress={toggleOverlay} />
                        }

                        {
                            (data?.path != "" && Platform.OS != "ios") &&
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
                                            setData(prevState => ({ ...prevState, path: "" }))
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
                            (data?.path != "" && Platform.OS == "ios") &&
                            (
                                <View>
                                    <View style={{ justifyContent: "space-around", flexDirection: "row", marginTop: 5 }}>
                                        <View style={{ width: '49%' }}>
                                            <TouchableOpacity onPress={pickImage}>
                                                <View style={{ height: 50, borderColor: 'grey', borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginBottom: 5 }}>
                                                    <Text>Browse</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ width: '49%' }}>
                                            <TouchableOpacity onPress={captureImage}>
                                                <View style={{ height: 50, borderColor: 'grey', borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginBottom: 5 }}>
                                                    <Text>Capture</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{ justifyContent: "space-around", flexDirection: "column", marginTop: 5 }}>
                                        <View style={{ width: '99%' }}>
                                            <TouchableOpacity onPress={() => {
                                                setData(prevState => ({ ...prevState, path: "" }))
                                            }
                                            }>
                                                <View style={{ height: 50, borderColor: 'grey', borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center' }}>
                                                    <Text>Delete</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )
                        }

                        {
                            (data?.path != "" && data?.capture_on != null) && (
                                <DatePicker
                                    label="Capture On"
                                    initialDate={new Date(moment(data?.capture_on).format())}
                                    required={false}
                                    onChange={(data) => setData(prevState => ({ ...prevState, capture_on: data }))}
                                    selectedDate={new Date(moment(data?.capture_on).format())} />
                            )
                        }

                        {
                            (data?.path != "" && data?.capture_on == null) &&
                            <DatePicker
                                label="Capture On"
                                initialDate={new Date(moment(data?.capture_on).format())}
                                required={false}
                                onChange={(data) => setFirstCaptureOn(data)}
                                selectedDate={new Date(moment(data?.capture_on).format())} />
                        }

                        <LongText label="Comments" required={false} value={data.remark} onChange={(data) => setData(prevState => ({ ...prevState, remark: data }))} />
                    </View>
                    <LongText label="Remarks" required={false} value={data.progress?.comments} onChange={(data) => setData(prevState => ({ ...prevState, progress: { ...prevState.progress, comments: data } }))} />
                </ScrollView>
                <SafeAreaView>
                    <DefaultButton onPress={onSubmitCreation} textButton="SAVE CHANGES" />
                </SafeAreaView>
            </View>
        </View>
    )
}

export default ProgressEditScreen;