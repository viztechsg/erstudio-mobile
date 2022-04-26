import api from '../api/api';
import { store } from '../store/store';

export function approveSI(quo_id,type,remarks,approved_amount) {
    return api.put(`/supplier-invoice/${quo_id}/${type}/approve`, {
        type: "approve",
        approved_amount,
        remarks
    }, {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    })
        .then(response => {
           return response.data;
        })
        .catch(err => console.log(err.response));
}

export function rejectSI(si_id, reject_reason) {
    return api.put(`/supplier-invoice/${si_id}/reject`, {
        reject_reason
    }, {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    })
        .then(response => {
            return response.data;
        })
        .catch(err => console.log(err.response));
}

export function updateRemark(si_id, remarks, reject_reason) {
    return api.put(`/supplier-invoice/${si_id}/update-remark`, {
        remarks,
        reject_reason
    }, {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    })
        .then(response => {
            return response.data;
        })
        .catch(err => console.log(err.response));
}

export function holdSI(si_id,reject_reason) {
    return api.put(`/supplier-invoice/${si_id}/onhold`, {
        type: "onhold",
        remarks: reject_reason
    }, {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    })
        .then(response => {
            return response.data;
        })
        .catch(err => console.log(err.response));
}