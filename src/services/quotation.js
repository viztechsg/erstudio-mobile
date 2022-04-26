import api from '../api/api';
import { store } from '../store/store';
export function getQuotationUrl(quo_id) {
    return api.get(`/quotation-view/${quo_id}`, {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    })
        .then(response => {
            return response.data.url;
        })
        .catch(err => console.log(err.response));
}

export function approveQuotation(quo_id) {
    return api.put(`/approve-quotation/${quo_id}`, {
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

export function signQuotation(quo_id,customer_sign) {
    return api.put(`/sign-quotation/${quo_id}`, {
        customer_sign
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

export function rejectQuotation(quo_id, cancel_reason) {
    return api.put(`/cancel-quotation/${quo_id}`, {
        cancel_reason
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