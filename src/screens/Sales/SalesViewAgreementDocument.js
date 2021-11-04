import React, { useEffect } from 'react';
import { StyleSheet, Dimensions, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/AntDesign';
import { useState } from 'react';
import { getAgreementUrl } from '../../services/agreement';
// import {salesViewDocumentOption} from '../../general/Header/SalesHeader';
// import Pdf from 'react-native-pdf';

const SalesViewAgreementDocument = ({ navigation }) => {
    const { item, type, uri } = navigation.state.params;
    const [fixedURI, setFixedURI] = useState(uri);

    useEffect(() => {
        navigation.setParams({
            item: item,
            type: type
        });
        if (type == "Agreement" && uri == "need-fetch") {
            getAgreementUrl(item.id).then(data => setFixedURI(data));
        }
    }, [item.id])
    return (
        <View style={{ flex: 1 }}>
            <View style={{ padding: 20, backgroundColor: '#202020', flexDirection: 'row' }}>
                <View style={{ width: '80%' }}>
                    <Text style={{ color: 'white', fontSize: 16 }}>{type}</Text>
                    {
                        (type == 'Agreement' && item.is_approved == 0) ?
                            <Text style={{ color: 'white', fontSize: 12 }}>
                                This document need approval
                            </Text>
                            :
                            <Text style={{ color: 'white', fontSize: 12 }}>
                                This document has been approved
                            </Text>
                    }
                    {
                        (type == 'Agreement' && item.client_sign == null) ?
                            <Text style={{ color: 'white', fontSize: 12 }}>
                                This document need to be signed
                            </Text>
                            :
                            <Text style={{ color: 'white', fontSize: 12 }}>
                                This document has been signed
                            </Text>
                    }
                </View>
                {
                    item.client_sign == null && (
                        <View style={{ width: '18%', alignItems: 'flex-end' }}>
                            <TouchableOpacity onPress={() => navigation.navigate('SalesSignAgreement', { id: item.id })}>
                                <Icon name='infocirlceo' size={20} color='white' />
                            </TouchableOpacity>
                        </View>
                    )
                }
            </View>

            <WebView style={{ flex: 1 }} source={{ uri: `http://docs.google.com/gview?embedded=true&url=${fixedURI}` }} />
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