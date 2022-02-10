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
import { getVaritaionOrderUrl } from '../../services/sales';
import * as WebBrowser from 'expo-web-browser';
const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const SalesViewVO = ({ navigation }) => {
    const { item, type, uri, project_data } = navigation.state.params;
    const [fixedURI, setFixedURI] = useState(uri);
    const [refreshing, setRefreshing] = useState(false);
    useEffect(() => {
        navigation.setParams({
            item: item,
            type: type,
            project_data
        });
    }, [item.id])

    useEffect(() => {
        setRefreshing(true);
        getVaritaionOrderUrl(item.id).then(data => { setRefreshing(false); setFixedURI(data); _handlePressButtonAsync(data) });

    }, [item.id]);

    const _handlePressButtonAsync = async (data) => {
        await WebBrowser.openBrowserAsync(data);
    };

    return (
        <View style={{ flex: 1 }}>
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

export default SalesViewVO;