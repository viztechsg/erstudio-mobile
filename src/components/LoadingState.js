import React from "react";
import {
    Text,
    View,
    TextInput,
    StyleSheet,
    ActivityIndicator
}
    from "react-native";
import { Overlay } from "react-native-elements";

const LoadingState = ({ value, onChange, ...props }) => {
    return (
        <Overlay
            isVisible={props.isUploading}
            overlayStyle={{ width: '50%' }}
        >
            <ActivityIndicator
                animating={props.isUploading}
                style={{ height: 100 }}
                color="#C00"
                size="large"
            />
            <Text style={{ textAlign: 'center' }}>{props.content ? props.content : "Uploading, please wait.."}</Text>
        </Overlay>
    );
};

const styles = StyleSheet.create({
    inputSection: {
        height: 120,
        backgroundColor: 'white',
        justifyContent: 'flex-start',
        padding: 5,
        textAlignVertical: 'top',
        elevation: 3,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
    },
});

export default LoadingState;


