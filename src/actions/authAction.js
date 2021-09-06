import { Alert } from 'react-native'; // to show alerts in app
import api from '../api/api';
import { store } from '../store/store';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-community/async-storage";
export function login(params) {
    const { email, password, navigation, remember } = params;

    return (dispatch) => {
        dispatch(loginBegin())

        api.post('/login', {
            email: email,
            password: password
        })
            .then((data) => {
                console.log(data.data);
                dispatch(setLoginState(data.data));
                if(remember)
                {
                    rememberUser(email,password,"true");
                }
                

            })
            .then(() => {
                navigation.navigate('Home');
            })
            .catch((error) => {
                Alert.alert("Login Failure", error.response.data.message);
                dispatch({
                    type: "CREATE_SESSION_ERROR",
                    payload: error
                });
            })
        console.log(store.getState().loginReducer);
    }
}

export function logout() {
    return (dispatch) => {
        removeRememberUser();
        dispatch({ type: "SET_LOGOUT_STATE" });
    }
}

const loginBegin = () => ({
    type: "PREPARE_LOGIN"
})

const loginFailure = (error) => ({
    type: "LOGIN_FAILURE",
    payload: error
})

const setLoginState = (loginData) => {
    return {
        type: "SET_LOGIN_STATE",
        payload: loginData,
    };
};

const rememberUser = async (email,password,remember) => {
    try {
        await AsyncStorage.setItem('isRemember', remember);
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('password', password);
    } catch (error) {
        // Error saving data
    }
};

const removeRememberUser = async() => {
    try{
        await AsyncStorage.removeItem('isRemember');
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('password');
    }
    catch (e) {
        console.log(e);
    }

}