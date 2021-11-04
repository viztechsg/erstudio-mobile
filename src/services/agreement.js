import api from '../api/api';
import { store } from '../store/store';

export function getAgreementUrl(agreement_id) {
    return api.get(`/agreement-view/${agreement_id}`, {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    })
        .then(response => {
            return response.data.url;
        })
        .catch(err => console.log(err));
}

export function approveAgreement(agreement_id) {
    return api.put(`/agreement/${agreement_id}/approve`, {
        type: "approve"
    }, {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    })
        .then(response => {
            console.log(response.data)
        })
        .catch(err => console.log(err.response));
}

export function signAgreement(agreement_id,client_sign) {
    return api.put(`/sign-agreement/${agreement_id}`, {
        client_sign
    }, {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    })
        .then(response => {
            console.log(response.data)
        })
        .catch(err => console.log(err.response));
}
