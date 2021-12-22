import React, { useEffect } from 'react';
import { StyleSheet, Dimensions, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/AntDesign';
import { useState } from 'react';
import { getQuotationUrl } from '../../services/quotation';
// import {salesViewDocumentOption} from '../../general/Header/SalesHeader';
// import Pdf from 'react-native-pdf';
import LoadingState from '../../components/LoadingState';
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
    }, [item.id])
    return (
        <View style={{ flex: 1 }}>
            <View style={{ padding: 20, backgroundColor: '#202020', flexDirection: 'row' }}>
                <View style={{ width: '80%' }}>
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
            <WebView style={{ flex: 1 }} source={{ uri: `http://docs.google.com/gview?url=${fixedURI}` }} />
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