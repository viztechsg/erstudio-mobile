import React from "react";
import { 
        Text, 
        View, 
        TextInput, 
        CheckBox, 
        TouchableOpacity, 
        Image }
        from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';
import styles from './styles';
const ResetPasswordScreen = () => {
    return (
        <View style={{
            flex: 1,
            flexDirection: 'column',
            //justifyContent: 'center',
            alignItems: 'stretch',
            padding: 20,
        }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', paddingTop: 25 }}>
                <Text style={{ color: '#707070', fontSize: 24, letterSpacing: 5 }}>
                    RESET PASSWORD
                </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', paddingTop: 25, marginBottom:30 }}>
                <Text style={{ color: '#707070', fontSize: 14,}}>
                    Enter the email address associated with your account and an email will be sent to you with instructions to reset your password
                </Text>
            </View>
            <View style={styles.inputSection}>
                <Icon style={styles.searchIcon} name="mail" size={20} color="#000" />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    underlineColorAndroid="transparent"
                />
            </View>
            <View style={[styles.buttonSection, {marginTop:30}]}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.textButton}>CONTINUE</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ResetPasswordScreen;
