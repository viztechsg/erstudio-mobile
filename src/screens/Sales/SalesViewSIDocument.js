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
import { Overlay } from 'react-native-elements';
import LongText from '../../components/LongText';
import DefaultButton from '../../components/DefaultButton';
import { Platform } from 'react-native';
import TextField from '../../components/TextField';
import moment from 'moment';
import { KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { updateRemark } from '../../services/supplierInvoice';
import { Alert } from 'react-native';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const SalesViewSIDocument = ({ navigation }) => {
    const { item, type, uri, project_data } = navigation.state.params;
    const [fixedURI, setFixedURI] = useState(uri);
    const [refreshing, setRefreshing] = useState(false);
    const [isVisibleModal, setIsVisibleModal] = useState(false);
    const [remark, setRemark] = useState("");

    const sumApprovalLogs = () => {
        var sum_value = 0;
        item.approval_logs?.map((value, index) => {
            sum_value = sum_value + parseInt(value.approved_amount);
        });

        return sum_value.toString();
    }

    const summedApprovalLogs = sumApprovalLogs();
    useEffect(() => {
        navigation.setParams({
            item: item,
            type: type,
            project_data
        });

        var remarks = '';

        if (item.remarks && item.status != "Rejected") {
            remarks += item.remarks + "\n";
        }
        else{
            if (item.approval_logs) {
                item.approval_logs?.map((value, index) => {
                    if (value.remark != null) {
                        remarks += value.remark + "\n"
                    }
    
                });
            }
        }



        if (item.reject_reason) {
            remarks += item.reject_reason + "\n";
        }


        setRemark(remarks);

    }, [item.id]);

    const modalToggle = () => {
        setIsVisibleModal(!isVisibleModal);
    }

    const onUpdateRemark = si_id => {
        
        // Check status
        var remarks = remark;
        var reject_reason = remark;
        if (item.status == "Rejected") {
            remarks = "";
        }
        else {
            reject_reason = "";
        }
        
        updateRemark(si_id, remarks, reject_reason).then(
            Alert.alert("Update Remark", "Supplier invoice remark updated")
        )

        modalToggle();
        navigation.navigate('SalesView', { item: project_data })
    }

    const _handlePressButtonAsync = async (attachment) => {
        await WebBrowser.openBrowserAsync(attachment);
    };

    return (
        <View style={{ flex: 1 }}>
            {/* DETAILS MODAL */}
            <Overlay
                visible={isVisibleModal}
                onBackdropPress={modalToggle}
                overlayStyle={{ width: '80%', marginBottom: Platform.OS == 'ios' ? 0 : 0, overflow: 'hidden' }}
            >
                <SafeAreaView>
                    <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={Platform.OS === "ios" ? 200 : 0}>
                        <ScrollView>
                            <Text
                                style={
                                    {
                                        color: 'grey', fontWeight: '800', fontSize: 18, fontSize: 16,
                                        fontWeight: 'bold'
                                    }
                                }>
                                Details
                            </Text>
                            {
                                item.approval_logs.length > 0 && (
                                    <View>
                                        <View style={{ marginTop: 15 }}>
                                            <Text style={{ fontWeight: "bold" }}>Supplier Invoice Amount</Text>
                                            <Text>${item.amount}</Text>
                                        </View>
                                        <View style={{ marginTop: 15 }}>
                                            <Text style={{ fontWeight: "bold" }}>Approved Total</Text>
                                            <Text>${summedApprovalLogs}</Text>
                                        </View>
                                        <View style={{ marginTop: 15 }}>
                                            <Text style={{ fontWeight: "bold" }}>Last Approved Amount</Text>
                                            <Text>${item.approval_logs[item.approval_logs.length - 1].approved_amount}</Text>
                                        </View>
                                        <View style={{ marginTop: 15 }}>
                                            <Text style={{ fontWeight: "bold" }}>Last Approved Date</Text>
                                            <Text>{moment(item.approval_logs[item.approval_logs.length - 1].created_at).format("DD/MM/YYYY")}</Text>
                                        </View>
                                    </View>
                                )
                            }

                            <LongText label="Remark" value={remark} onChange={(remark) => setRemark(remark)} />

                        </ScrollView>

                        <View>
                            <DefaultButton onPress={() => onUpdateRemark(item.id)} textButton="SAVE CHANGES" />
                        </View>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </Overlay>

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

                    {
                        item.status != "Pending" && (
                            <TouchableOpacity style={{ marginTop: 15 }} onPress={modalToggle}>
                                <Text style={{ color: '#199FF6', fontSize: 16 }}>Details</Text>
                            </TouchableOpacity>
                        )
                    }

                </View>
            </View>
            {/* <View style={{height:30, padding:5}}>
                <TouchableOpacity onPress={reloadDoc}>
                    <Text style={{textAlign:'center'}}>Reload document</Text>
                </TouchableOpacity>
            </View> */}
            {
                item.documents?.length > 0 ? (
                    <View style={{ justifyContent: 'space-between', alignItems: 'flex-start', margin: 20, marginBottom: 0 }}>
                        <Text>Documents</Text>
                    </View>
                ) :
                    (
                        <View style={{ justifyContent: 'space-between', alignItems: 'flex-start', margin: 20, marginBottom: 0 }}>
                            <Text>No documents</Text>
                        </View>
                    )
            }

            <View style={{ minHeight: '100%', justifyContent: 'space-between', alignItems: 'flex-start', margin: 20, flexDirection: 'row', flexWrap: 'wrap' }}>
                {
                    item.documents?.map((value, index) => {
                        return (<TouchableOpacity onPress={() => _handlePressButtonAsync(value.attachment_path)} style={{ borderRadius: 5, width: '49%', borderColor: 'black', borderWidth: 1, padding: 40, backgroundColor: '#f3f3f3', marginTop: 5 }}>
                            <Text style={{ textAlign: 'center' }}>{value.name}</Text>
                        </TouchableOpacity>)
                    })
                }

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