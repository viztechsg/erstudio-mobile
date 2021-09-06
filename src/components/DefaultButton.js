import React from "react";
import {
    Text,
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity
}
    from "react-native";

const DefaultButton = props => {

    return (
        <View style={styles.buttonSection}>
            <TouchableOpacity style={[styles.button, {backgroundColor: (props.disabled == true) ? '#B9B9B9' : 'white'}]} onPress={props.onPress} disabled={props.disabled ? props.disabled : false}>
                <Text style={styles.textButton}>{props.textButton}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonSection: {
        alignItems: 'center',
        marginTop:15,
        marginBottom:10,
    },
    button: {
        backgroundColor: '#fff',
        width: '80%',
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        shadowColor: 'black',
        shadowRadius: 100,
        shadowOpacity: 100,
        borderWidth: 1,
        borderColor: '#7070',
        elevation:1
    },
    textButton: {
        color: '#707070',
        fontWeight: '600',
        fontSize: 20,

    }
});

export default DefaultButton;
