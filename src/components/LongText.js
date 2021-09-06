import React from "react";
import {
    Text,
    View,
    TextInput,
    StyleSheet
}
    from "react-native";

const LongText = ({value, onChange, ...props}) => {

    return (
        <View style={{ marginTop: 20 }}>
            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                {props.label &&
                    <Text>{props.label}</Text>
                }

                {props.required &&
                    <Text style={{ color: 'red' }}>*</Text>
                }
            </View>
            <TextInput
                multiline={true}
                numberOfLines={10}
                style={styles.inputSection}
                placeholder="Type Something"
                onChangeText={onChange}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    inputSection: { 
        height: 120, 
        backgroundColor: 'white', 
        justifyContent: 'flex-start', 
        padding:5, 
        textAlignVertical: 'top',
        elevation:1
    },
});

export default LongText;
