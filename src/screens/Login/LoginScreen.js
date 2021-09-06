import React, { useState, useEffect } from "react";
import {
    Text,
    View,
    CheckBox,
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
import AsyncStorage from "@react-native-community/async-storage";
const LoginScreen = ({ navigation }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setLoading] = useState(store.getState().loginReducer.isLoading);
    const [remember, setRemember] = useState(false);
    const [asyncToken, setAsyncToken] = useState("");
    const dispatch = useDispatch();
    const onEmailChange = email => {
        setEmail(email);
    }

    const onPasswordChange = password => {
        setPassword(password);
    }

    const onLogin = () => {
        dispatch(login({ email, password, navigation, remember }));
    }

    const fetchTokenFromAsyncStorage = async () => {
        let isRemember = await AsyncStorage.getItem('isRemember');
        let email = await AsyncStorage.getItem('email');
        let password = await AsyncStorage.getItem('password');

        if(isRemember)
        {
            dispatch(login({ email, password, navigation, remember: "true" }));

            navigation.navigate( store.getState().loginReducer.isLoggedIn ? 'Home' : 'Login');
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
                <View>
                    <View style={styles.imgContainer}>
                        <Image style={styles.logoImg} source={require('../../../assets/ERLOGO.png')} />
                    </View>
                    <View style={styles.labelLogin}>
                        <Text style={styles.loginText}>
                            LOGIN
                        </Text>
                    </View>
                    <TextFieldWithIcon iconName="idcard" placeholder="Email" required={false} hidden={false} onChange={email => setEmail(email)} value={email} />
                    <TextFieldWithIcon iconName="lock" placeholder="Password" required={true} hidden={true} onChange={password => setPassword(password)} value={password} />
                    <View style={styles.rememberSection}>
                        <CheckBox value={remember} onValueChange={setRemember} />
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
            )}

        </View>
    );
};

export default connect(null, { login })(LoginScreen);
