import React, { useState, useEffect } from "react";
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    ActivityIndicator
}
    from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';
import TextFieldWithIcon from '../../components/TextFieldWithIcon';
import styles from './styles';
import { useDispatch, connect } from 'react-redux';
import { store } from '../../store/store';
import { login } from '../../actions/authAction';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from 'expo-notifications';
import { KeyboardAvoidingView } from "react-native";
import { Platform } from "react-native";
import { Checkbox } from 'react-native-paper';
const LoginScreen = ({ navigation }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setLoading] = useState(store.getState().loginReducer.isLoading);
    const [remember, setRemember] = useState(false);
    const [asyncToken, setAsyncToken] = useState("");
    const [pushToken, setPushToken] = useState("");
    const dispatch = useDispatch();
    const onEmailChange = email => {
        setEmail(email);
    }

    const onPasswordChange = password => {
        setPassword(password);
    }

    useEffect(() => {
        Notifications.getExpoPushTokenAsync().then(data => {setPushToken(data.data); console.log(data.data)});
        // Notifications.getNotificationCategoriesAsync().then(data => console.log(data))
    }, []);

    const onLogin = () => {
        if (Platform.OS == "ios") {
            setRemember(remember);
        }
        dispatch(login({ email, password, navigation, remember, push_token: pushToken }));
    }

    const fetchTokenFromAsyncStorage = async () => {
        let isRemember = await AsyncStorage.getItem('isRemember');
        let email = await AsyncStorage.getItem('email');
        let password = await AsyncStorage.getItem('password');

        if (isRemember) {
            dispatch(login({ email, password, navigation, remember: "true" }));

            navigation.navigate(store.getState().loginReducer.isLoggedIn ? 'Home' : 'Login');
        }
    }

    useEffect(() => {
        let tokenAsync = false;
        fetchTokenFromAsyncStorage()
            .then(data => {
                console.log(data);
            })
            .catch(e => console.log(e));

        return () => { tokenAsync = true };
    }, []);

    store.subscribe(() => {
        setLoading(!isLoading);
    });


    return (

        <View style={styles.wrapper}>
            {store.getState().loginReducer.isLoading ? (
                <ActivityIndicator
                    style={{ height: 200 }}
                    color="#C00"
                    size="large"
                />
            ) : (
                <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>
                    <View>
                        <View style={styles.imgContainer}>
                            <Image style={styles.logoImg} source={require('../../../assets/new-logo.png')} />
                        </View>
                        <View style={styles.labelLogin}>
                            <Text style={styles.loginText}>
                                LOGIN
                            </Text>
                        </View>
                        <TextFieldWithIcon key='login_input' autoCapitalize='none' keyboardType='email-address' iconName="idcard" placeholder="Email" required={false} hidden={false} onChange={email => setEmail(email)} value={email} />
                        <TextFieldWithIcon key='login_password' autoCapitalize='none' iconName="lock" placeholder="Password" required={true} hidden={true} onChange={password => setPassword(password)} value={password} />
                        <View style={styles.rememberSection}>
                            <Checkbox.Android status={remember ? "checked" : "unchecked"} onPress={() => setRemember(!remember)} color='green' />
                            
                            <Text>Remember Me</Text>
                            <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.navigate('ResetPassword')}>
                                <Text style={{ textAlign: 'right' }} >Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.buttonSection}>
                            <TouchableOpacity style={styles.button} onPress={() => onLogin(email, password)}>
                                <Text style={styles.textButton}>CONTINUE</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            )}

        </View>
    );
};

export default connect(null, { login })(LoginScreen);
