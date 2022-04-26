import React, { useState, useRef } from 'react';
import { Alert } from 'react-native';
import { StyleSheet, Text, View, Image, Button, CheckBox, TouchableOpacity } from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';

import { Checkbox } from 'react-native-paper';
import { Platform } from 'react-native';
import { signVO } from '../../services/variationOrder';
import { signHandover } from '../../services/sales';

const SalesSignHandover = ({ navigation, onOK }) => {
    const [signature, setSign] = useState(null);
    const [agree, setAgree] = useState(false);
    const { id, item } = navigation.state.params;
    const ref = useRef();

    const handleSignature = signature => {
        setSign(signature);
    };

    const handleClear = () => {
        ref.current.clearSignature();
        setSign(null);
    }

    const handleEnd = () => {
        ref.current.readSignature();
    };

    const handleConfirm = () => {
        if(signature == null)
        {
            Alert.alert("Signing","Please sign first");
            return;
        }

        if(agree == false)
        {
            Alert.alert("Terms & Conditions","Please agree");
            return;
        }
        signHandover(id,signature).then(Alert.alert("Handover Signing","Handover has been signed")).then(handleClear).then(navigation.navigate('SalesView', { item: item }));
    }

    const style = `
    .m-signature-pad--footer {display: none; margin: 0px;}
    .m-signature-pad {
        position: absolute;
        font-size: 10px;
        width: 100%;
        height: 100%;
        border: 0px solid #e8e8e8;
        background-color: #fff;
        box-shadow: 0 0px 0px rgba(0, 0, 0, 0.27), 0 0 0px rgba(0, 0, 0, 0.08) inset;
      }`;
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.preview}>
                {/* {signature ? (
                    <Image
                        resizeMode={"contain"}
                        style={{ width: 335, height: 114 }}
                        source={{ uri: signature }}
                    />
                ) : null} */}
                <Text style={{ color: 'white', fontSize: 16 }}>Handover Customer's Signature</Text>
            </View>
            <View style={styles.container}>
                <SignatureScreen
                    ref={ref}
                    onEnd={handleEnd}
                    onOK={handleSignature}
                    webStyle={style}
                />
                <View style={styles.row}>
                    <View style={{ justifyContent: 'flex-start', flexDirection: 'row', padding: 5 }}>
                    <Checkbox.Android status={agree ? "checked" : "unchecked"} onPress={() => setAgree(!agree)} color='green' />
                        <Text style={{ fontSize: 12 }}>I agree to all terms & conditions stated in this agreement</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleConfirm}
                        >
                            <Text>SAVE</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleClear}
                        >
                            <Text>CLEAR</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    preview: {
        height: 50,
        justifyContent: 'center',
        backgroundColor: "black",
        padding: Platform.OS == "ios" ? 2 : 20,
    },
    previewText: {
        color: "#FFF",
        fontSize: 14,
        height: 40,
        lineHeight: 40,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: "#69B2FF",
        width: 120,
        textAlign: "center",
        marginTop: 10
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: 10,
    },
    row: {
        display: "flex",
        width: '100%',
        marginTop: 20,
        marginBottom: 10
    },
    button: {
        height: 60,
        width: '45%',
        backgroundColor: 'white',
        borderRadius: 5,
        justifyContent: 'center',
        padding: 10,
        alignItems: 'center',
        // borderWidth:1,
        // borderColor:'grey',
        elevation: 2
    }
});

export default SalesSignHandover;