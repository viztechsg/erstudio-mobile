import api from '../api/api';
import { store } from '../store/store';

export function signInvoice(invoice_id,customer_sign) {
    return api.put(`/sign-invoice/${invoice_id}`, {
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

export function getInvoiceUrl(invoice_id) {
    return api.get(`/invoice-view/${invoice_id}`, {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    })
        .then(response => {
            return response.data.url;
        })
        .catch(err => console.log(err.response));
}