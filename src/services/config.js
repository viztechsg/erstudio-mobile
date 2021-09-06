import { Alert } from 'react-native'; // to show alerts in app
import api from '../api/api';
import { store } from '../store/store';
import moment from 'moment';

export const allUsers = () => {
    return api.get('/users', {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    }) 
    .then(response => response)
    .then((data) => {return data.data})
    .catch(err => console.log(err));
}

export const getConditionTypes = () => {
    return api.get('/get-condition-type', {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    }) 
    .then(response => response)
    .then((data) => {return data.data})
    .catch(err => console.log(err));
}
