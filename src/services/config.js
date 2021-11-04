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


export const getRemarkSource = () => {
    return api.get('/get-remarks-source', {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    }) 
    .then(response => response)
    .then((data) => {return data.data})
    .catch(err => console.log(err));
}

export const getVenueSource = () => {
    return api.get('/get-venue-source', {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    }) 
    .then(response => response)
    .then((data) => {return data.data})
    .catch(err => console.log(err));
}

export const getCountryCodeSource = () => {
    return api.get('/get-country-source', {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    }) 
    .then(response => response)
    .then((data) => {return data.data})
    .catch(err => console.log(err));
}

export const getVendorSource = () => {
    return api.get('/get-vendor-source', {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    }) 
    .then(response => response)
    .then((data) => {return data.data})
    .catch(err => console.log(err));
}

export const getSowSource = () => {
    return api.get('/get-sow-source', {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    }) 
    .then(response => response)
    .then((data) => {return data.data})
    .catch(err => console.log(err));
}

export const getGroupSource = () => {
    return api.get('/get-group-source', {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    }) 
    .then(response => response)
    .then((data) => {return data.data})
    .catch(err => console.log(err));
}

export const getAreaSource = () => {
    return api.get('/get-area-source', {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    }) 
    .then(response => response)
    .then((data) => {return data.data})
    .catch(err => console.log(err));
}