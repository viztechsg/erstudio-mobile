import React from "react";
import { 
        Text, 
        View, 
        TextInput, 
        StyleSheet
        }
        from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';

const TextFieldWithIcon = ({children,value,onChange,...props}) => {

    return (
            <View style={styles.inputSection}>
                { props.iconName &&
                    <Icon style={styles.searchIcon} name={props.iconName} size={20} color="#000" />
                }
                <TextInput
                    // textContentType={'password'}
                    secureTextEntry={props.hidden}
                    style={styles.input}
                    placeholder={props.placeholder}
                    underlineColorAndroid="transparent"
                    onChangeText={onChange}
                    value={value}
                />
            </View>
    );
};

const styles = StyleSheet.create({
    inputSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        height: 50,
        marginBottom: 10
    },
    searchIcon: {
        padding: 10,
    },
    input: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 0,
        backgroundColor: '#fff',
        color: '#424242',
    },
});

export default TextFieldWithIcon;
