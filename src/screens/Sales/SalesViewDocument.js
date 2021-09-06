import React, {useEffect} from 'react';
import { StyleSheet, Dimensions, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/AntDesign';
// import {salesViewDocumentOption} from '../../general/Header/SalesHeader';
// import Pdf from 'react-native-pdf';

const SalesViewDocument = ({ navigation }) => {
    const source = 'https://file-examples-com.github.io/uploads/2017/10/file-sample_150kB.pdf';
    // useEffect(() => { 
    //     navigation.setOptions(salesViewDocumentOption) 
    // }, [])
    return (
        <View style={{ flex: 1 }}>
            <View style={{ padding: 20, backgroundColor: '#202020', flexDirection: 'row' }}>
                <View style={{ width: '80%' }}>
                    <Text style={{ color: 'white', fontSize: 16 }}>Quotation/Agreement</Text>
                    <Text style={{ color: 'white', fontSize: 12 }}>This document has been approved</Text>
                    <Text style={{ color: 'white', fontSize: 12 }}>This document has been signed</Text>
                </View>
                <View style={{ width: '18%', alignItems: 'flex-end' }}>
                    <TouchableOpacity onPress={() => navigation.navigate('SalesSignDocument')}>
                        <Icon name='infocirlceo' size={20} color='white' />
                    </TouchableOpacity>
                </View>
            </View>
            <WebView style={{ flex: 1 }} source={{ uri: `http://docs.google.com/gview?embedded=true&url=${source}` }} />
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

export default SalesViewDocument;