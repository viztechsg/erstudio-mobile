import api from '../api/api';
import { store } from '../store/store';

export function signVO(vo_id,customer_sign) {
    return api.put(`/sign-variation-order/${vo_id}`, {
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
