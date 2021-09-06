import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, Image, Button, CheckBox, TouchableOpacity } from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';

const SalesSignDocument = ({ onOK }) => {
    const [signature, setSign] = useState(null);

    const ref = useRef();

    const handleSignature = signature => {
        console.log(signature);
        setSign(signature);
    };

    const handleClear = () => {
        ref.current.clearSignature();
    }

    const handleConfirm = () => {
        console.log("end");
        ref.current.readSignature();
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
                <Text style={{ color: 'white', fontSize: 16 }}>Customer's Sign</Text>
            </View>
            <View style={styles.container}>
                <SignatureScreen
                    ref={ref}
                    onOK={handleSignature}
                    webStyle={style}
                />
                <View style={styles.row}>
                    <View style={{ justifyContent: 'flex-start', flexDirection: 'row', padding: 5 }}>
                        <CheckBox />
                        <Text style={{ fontSize: 12 }}>I agree to all terms & conditions stated in this quotation/agreement</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent:'space-between', marginTop:10 }}>
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
export default SalesSignDocument;
const styles = StyleSheet.create({
    preview: {
        height: 50,
        justifyContent: 'center',
        backgroundColor: "black",
        padding: 20,
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
        justifyContent:'center',
        padding:10,
        alignItems:'center',
        // borderWidth:1,
        // borderColor:'grey',
        elevation:2
    }
});