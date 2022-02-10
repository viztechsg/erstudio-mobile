import React, { useEffect } from 'react';
import { StyleSheet, Dimensions, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/AntDesign';
import { useState } from 'react';
import { getQuotationUrl } from '../../services/quotation';
import { useCallback } from 'react';
// import {salesViewDocumentOption} from '../../general/Header/SalesHeader';
// import Pdf from 'react-native-pdf';
import LoadingState from '../../components/LoadingState';
import * as WebBrowser from 'expo-web-browser';
import { Button } from 'native-base';
import { Platform } from 'react-native';
import { Badge, Overlay } from 'react-native-elements';
import RenderHTML from 'react-native-render-html';
import { getCompanyTerms } from '../../services/config';
import DefaultButton from '../../components/DefaultButton';
import { useWindowDimensions } from 'react-native';

const SalesViewDocument = ({ navigation }) => {
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
        getQuotationUrl(item.id).then(data => { setRefreshing(false); setFixedURI(data); _handlePressButtonAsync(data) });
        getCompanyTerms().then((htmlContent) => {
            var content = "";
            htmlContent.data.map((item,index) => {
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
                overlayStyle={{ width: '80%', height: 400 }}>
                    <ScrollView>
                        <RenderHTML 
                            source={{html: htmlContent}}
                            contentWidth={width}
                        />
                        <DefaultButton textButton="SIGN" onPress={() => { navigation.navigate('SalesSignDocument', { id: item.id, item: project_data }) } } />
                    </ScrollView>
            </Overlay>

            <View style={{ padding: 20, backgroundColor: '#202020', flexDirection: 'row', height: 120 }}>

                <View style={{ width: '80%' }}>
                    <LoadingState isUploading={refreshing} content="Preparing document.." />
                    <Text style={{ color: 'white', fontSize: 16 }}>{type}</Text>
                    {
                        (type == 'Quotation' && item.is_approved == 0 && item.status != 'declined') ?
                            <Text style={{ color: 'white', fontSize: 12 }}>
                                This document need approval
                            </Text>
                            :
                            (item.status != 'declined') ?
                                <Text style={{ color: 'white', fontSize: 12 }}>
                                    This document has been approved
                                </Text> : <View></View>
                    }

                    {
                        (type == 'Quotation' && item.customer_sign == null && item.status != 'declined') ?
                            <Text style={{ color: 'white', fontSize: 12 }}>
                                This document need to be signed
                            </Text>
                            :
                            (item.status != 'declined') ?
                                <Text style={{ color: 'white', fontSize: 12 }}>
                                    This document has been signed
                                </Text> : <View></View>
                    }
                    {
                        item.status == "declined" && <Text style={{ color: 'white', fontSize: 12 }}>
                            This document has been rejected
                        </Text>
                    }
                </View>
                {
                    item.status != "declined" &&
                    <View style={{ width: 60, height: 50 }}>
                        {
                            Platform.OS == "ios" && <Button style={{ backgroundColor: "transparent" }} onPress={toggleOverlay} >
                                <Icon name='form' size={20} color='white' />
                            </Button>
                        }

                        {
                        Platform.OS == "android" &&
                            <TouchableOpacity style={{ width: '100%' }} key="SIGN_KEY" onPress={toggleOverlay}>
                                <Icon name='form' size={20} color='white' />
                            </TouchableOpacity>
                        }
                    </View>
                }
            </View>

            <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center', marginTop: -80 }}>
                <TouchableOpacity key="ADJHSJDI" onPress={() => _handlePressButtonAsync(fixedURI)} style={{ borderRadius: 5, borderColor: 'black', borderWidth: 1, padding: 40, backgroundColor: '#f3f3f3' }}>
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

export default SalesViewDocument;