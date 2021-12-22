import React, { useEffect } from 'react';
import { StyleSheet, Dimensions, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/AntDesign';
import { useState } from 'react';
import { getAgreementUrl } from '../../services/agreement';
// import {salesViewDocumentOption} from '../../general/Header/SalesHeader';
// import Pdf from 'react-native-pdf';
import LoadingState from '../../components/LoadingState';
const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}
const SalesViewAgreementDocument = ({ navigation }) => {
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
            setRefreshing(true)
            getAgreementUrl(item.id).then(data => setFixedURI(data));
            wait(2000).then(()=>setRefreshing(false));
    },[item.id]);

    const reloadDoc = () => {
        setRefreshing(true);
        getAgreementUrl(item.id).then(data => setFixedURI(data));
        wait(3000).then(() => setRefreshing(false))
    };

    return (
        <View style={{ flex: 1 }}>
            <LoadingState isUploading={refreshing} content="Loading document.." />
            <View style={{ padding: 20, backgroundColor: '#202020', flexDirection: 'row' }}>
                <View style={{ width: '80%' }}>
                    <Text style={{ color: 'white', fontSize: 16 }}>{type}</Text>
                    {
                        (type == 'Agreement' && item.is_approved == 0 && item.status != 'declined') ?
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
                        (type == 'Agreement' && item.client_sign == null && item.status != 'declined') ?
                            <Text style={{ color: 'white', fontSize: 12 }}>
                                This document need to be signed
                            </Text>
                            :
                            (item.status != 'declined') ?
                                <Text style={{ color: 'white', fontSize: 12 }}>
                                    This document has been signed
                                </Text> : <View></View>
                    }
                </View>
                {
                    item.status != "declined" && (
                        <View style={{ width: '18%', alignItems: 'flex-end' }}>
                            <TouchableOpacity onPress={() => navigation.navigate('SalesSignAgreement', { id: item.id })}>
                                <Icon name='infocirlceo' size={20} color='white' />
                            </TouchableOpacity>
                        </View>
                    )
                }
            </View>

            <View style={{height:30, padding:5}}>
                <TouchableOpacity onPress={reloadDoc}>
                    <Text style={{textAlign:'center'}}>Reload document</Text>
                </TouchableOpacity>
            </View>

            {
                (fixedURI != "need-fetch") && (<WebView style={{ flex: 1 }} source={{ uri: `http://docs.google.com/viewer?url=${fixedURI}` }} />)
            }
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

export default SalesViewAgreementDocument;