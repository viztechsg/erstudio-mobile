import { Alert } from 'react-native'; // to show alerts in app
import api from '../api/api';
import { store } from '../store/store';
import moment from 'moment';

export const dashboardData = () => {
    return api.get('/dashboard', {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    }) 
    .then(response => response)
    .then((data) => {return data.data})
    .catch(err => console.log(err.response));
}
