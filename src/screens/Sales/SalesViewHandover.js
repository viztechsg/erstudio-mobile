import React, { useEffect } from 'react';
import { StyleSheet, Dimensions, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { useState } from 'react';
import LoadingState from '../../components/LoadingState';
import * as WebBrowser from 'expo-web-browser';
import RenderHTML from 'react-native-render-html';
import { getCompanyTerms } from '../../services/config';
import DefaultButton from '../../components/DefaultButton';
import { Badge, Overlay } from 'react-native-elements';
import { useWindowDimensions } from 'react-native';
import { getHandoverUrl } from '../../services/sales';
const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const SalesViewHandover = ({ navigation }) => {
    const { item, type, uri, project_data } = navigation.state.params;
    const [fixedURI, setFixedURI] = useState(uri);
    const [refreshing, setRefreshing] = useState(false);
    const [showTnc, setShowTnc] = useState(false);
    const [htmlContent, setHtmlContent] = useState("");
    const { width } = useWindowDimensions();
    useEffect(() => {
        navigation.setParams({
            item: item,
            type: type,
            project_data
        });
    }, [item.id])

    useEffect(() => {
        setRefreshing(true);
        getHandoverUrl(item.id).then(data => { setRefreshing(false); setFixedURI(data); _handlePressButtonAsync(data) });
        getCompanyTerms(project_data.company_id, project_data.property_type_id).then((htmlContent) => {
            var content = "";
            htmlContent.data.map((item, index) => {
                content += item.content;
            });

            setHtmlContent(content);
        });
    }, [item.id]);

    const _handlePressButtonAsync = async (data) => {
        await WebBrowser.openBrowserAsync(data);
    };

    const toggleOverlay = () => {
        setShowTnc(!showTnc);
    }

    return (
        <View style={{ flex: 1 }}>
            <Overlay
                isVisible={showTnc}
                onBackdropPress={toggleOverlay}
                overlayStyle={{ width: '80%', maxHeight: 400 }}>
                <ScrollView>
                    <RenderHTML
                        source={{ html: htmlContent }}
                        contentWidth={width}
                    />
                    <DefaultButton textButton="SIGN" onPress={() => { navigation.navigate('SalesSignHandover', { id: item.id, item: project_data }) }} />
                </ScrollView>
            </Overlay>
            <View style={{ padding: 20, backgroundColor: '#202020', flexDirection: 'row', height: 120 }}>
                <View style={{ width: '80%' }}>
                    <Text style={{ color: 'white', fontSize: 16 }}>Handover: {project_data.project_no}</Text>
                    {
                        (item.client_sign == null) ?
                            <Text style={{ color: 'white', fontSize: 12 }}>
                                This document need to be signed
                            </Text>
                            :
                            (item.client_sign != null) ?
                                <Text style={{ color: 'white', fontSize: 12 }}>
                                    This document has been signed
                                </Text> : <View></View>
                    }
                </View>
                <View style={{ width: 60, height: 50 }}>
                    {
                        Platform.OS == "ios" && <Button style={{ backgroundColor: "transparent" }} onPress={toggleOverlay} >
                            <Icon name='form' size={20} color='white' />
                        </Button>
                    }
                    {
                        Platform.OS == "android" && <TouchableOpacity onPress={toggleOverlay}>
                            <Icon name='form' size={20} color='white' />
                        </TouchableOpacity>
                    }

                </View>
            </View>
            <LoadingState isUploading={refreshing} content="Preparing document.." />
            <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center', marginTop: -80 }}>
                <TouchableOpacity onPress={() => _handlePressButtonAsync(fixedURI)} style={{ borderRadius: 5, borderColor: 'black', borderWidth: 1, padding: 40, backgroundColor: '#f3f3f3' }}>
                    <Text style={{ textAlign: 'center' }}>View Document</Text>
                </TouchableOpacity>
            </View>

        </View >


    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    }
});

export default SalesViewHandover;