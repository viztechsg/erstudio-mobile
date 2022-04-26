import { Alert } from 'react-native'; // to show alerts in app
import api from '../api/api';
import { store } from '../store/store';
import moment from 'moment';

export function getSalesList(status = '', start_date = '', end_date = '', needAttention = "no-need") {
    return api.get(`/projects?status=${status}&start_date=${start_date}&end_date=${end_date}&needAttention=${needAttention}`, {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    })
        .then((data) => {
            return data.data.data.items;
        })
        .catch((error) => {
            console.log(error.response);
        });
}

export function getSingleProject(project_id) {
    return api.get(`/projects/${project_id}`, {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    })
        .then(response => {
            return response.data.data.project;
        })
        .catch(err => console.log(err));
}

export function addProjectWorkSchedule(data) {
    const { project_id, vendor_id, start_date, end_date, venue, scope_of_work, sow_id, vendor_free_text, vendor_contact,remark } = data;
    return api.post('/work-schedules',
        {
            project_id,
            vendor_id: vendor_id ? vendor_id : null,
            venue,
            vendor_free_text: vendor_free_text ? vendor_free_text : null,
            vendor_contact,
            scope_of_work,
            start_date,
            end_date,
            sow_id,
            remark
        },
        {
            headers: {
                Authorization: `Bearer ${store.getState().loginReducer.token}`
            }
        })
        .then(() => {
            Alert.alert("Add work schedule", "Success");
        })
        .catch((error) => {
            Alert.alert("Add work schedule error", error.response.message);
            console.log(error.response);
        })
}

export function addProjectRemark(data) {
    const { project_id, time, title } = data;

    return api.post('/project-remark',
        {
            project_id,
            time,
            title
        },
        {
            headers: {
                Authorization: `Bearer ${store.getState().loginReducer.token}`
            }
        })
        .then(() => {
            Alert.alert("Add remark", "Success");
        })
        .catch((error) => {
            Alert.alert("Create Lead Error", error.response.message);
            console.log(error.response);
        })
}

export function getVaritaionOrderUrl(vo_id) {
    return api.get(`/variation-order-view/${vo_id}`, {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    })
        .then(response => {
            return response.data.url;
        })
        .catch(err => console.log(err.response));
}

export function signHandover(id,customer_sign) {
    return api.put(`/sign-handover/${id}`, {
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

export function getHandoverUrl(id) {
    return api.get(`/handover-view/${id}`, {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    })
        .then(response => {
            return response.data.url;
        })
        .catch(err => console.log(err.response));
}