import api from '../api/api';
import { store } from '../store/store';

export function approveSI(quo_id) {
    return api.put(`/supplier-invoice/${quo_id}/approve`, {
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