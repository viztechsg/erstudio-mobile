import React, { useEffect } from 'react';
import { StyleSheet, Dimensions, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/AntDesign';
import { useState } from 'react';
import { getQuotationUrl } from '../../services/quotation';
// import {salesViewDocumentOption} from '../../general/Header/SalesHeader';
// import Pdf from 'react-native-pdf';
import LoadingState from '../../components/LoadingState';
import * as WebBrowser from 'expo-web-browser';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const SalesViewSIDocument = ({ navigation }) => {
    const { item, type, uri, project_data } = navigation.state.params;
    const [fixedURI, setFixedURI] = useState(uri);
    const [refreshing, setRefreshing] = useState(false);
    useEffect(() => {
        navigation.setParams({
            item: item,
            type: type,
            project_data
        });

        _handlePressButtonAsync();
    }, [item.id]);

    const _handlePressButtonAsync = async () => {
        await WebBrowser.openBrowserAsync(uri);
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{ padding: 20, backgroundColor: '#202020', flexDirection: 'row' }}>
                <View style={{ width: '80%' }}>
                <LoadingState isUploading={refreshing} content="Loading document.." />
                    <Text style={{ color: 'white', fontSize: 16 }}>{type}</Text>
                    {
                        (item.is_approved == 0 && item.status != "Rejected") ?
                            <Text style={{ color: 'white', fontSize: 12 }}>
                                This document need approval
                            </Text>
                            :
                            (item.status != "Rejected") ?
                                <Text style={{ color: 'white', fontSize: 12 }}>
                                    This document has been approved
                                </Text> : <View></View>
                    }

                    {
                        item.status == "Rejected" &&
                        <Text style={{ color: 'white', fontSize: 12 }}>
                            This document has been rejected
                        </Text>
                    }
                </View>
            </View>
            {/* <View style={{height:30, padding:5}}>
                <TouchableOpacity onPress={reloadDoc}>
                    <Text style={{textAlign:'center'}}>Reload document</Text>
                </TouchableOpacity>
            </View> */}

            <View style={{height:'100%',justifyContent:'center', alignItems:'center', marginTop:-80}}>
                <TouchableOpacity onPress={_handlePressButtonAsync} style={{borderRadius:5, borderColor:'black',borderWidth:1,padding:40, backgroundColor:'#f3f3f3'}}>
                    <Text style={{textAlign:'center'}}>View Document</Text>
                </TouchableOpacity>
            </View>
        </View>


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

export default SalesViewSIDocument;