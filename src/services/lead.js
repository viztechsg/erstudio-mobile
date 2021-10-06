import { Alert } from 'react-native'; // to show alerts in app
import api from '../api/api';
import { store } from '../store/store';
import moment from 'moment';

export function leadList() {
    return api.get('/leads', {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    }).then(response => { return response.data.data.lead })
        .catch(err => console.log(err));
}

export function leadRemark(lead_id) {
    return api.get(`/leads?lead_id=${lead_id}`, {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    }).then(response => { return response.data.data })
        .catch(err => console.log(err));
}

export function singleLead(lead_id) {
    return api.get(`/leads/${lead_id}`, {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    }).then(response => { return response.data.data.lead })
        .catch(err => console.log(err.response));
}

export function addLeadAppointment(data) {
    const { lead_id, company_id, name, venue, date, time, client_name, sales_name,pax, venue_two } = data;
    return api.post('/appointments',
        {
            lead_id: lead_id,
            company_id: company_id,
            name: name,
            date: date,
            venue: venue,
            time: time,
            client_name,
            sales_name,
            pax,
            venue_two
        },
        {
            headers: {
                Authorization: `Bearer ${store.getState().loginReducer.token}`
            }
        })
        .then(() => {
            Alert.alert("Add appointment", "Success");
        })
        .catch((error) => {
            Alert.alert("Create Lead Error", error.response.message);
            console.log(error.response)
        })
}

export function updateLeadAppointment(data) {
    const { appointmentId, name, venue, date, time, client_name, sales_name, pax, venue_two } = data;
    return api.put(`/appointments/${appointmentId}`,
        {
            name: name,
            date: date,
            venue: venue,
            time: time,
            client_name,
            sales_name,
            pax,
            venue_two
        },
        {
            headers: {
                Authorization: `Bearer ${store.getState().loginReducer.token}`
            }
        })
        .then(() => {
            Alert.alert("Update appointment", "Success");
        })
        .catch((error) => {
            Alert.alert("Update Lead Error", error.response.message);
            console.log(error.response)
        })
}

export function addLeadRemark(data) {
    const { lead_id, remarks, remark_id } = data;

    return api.post('/lead-remark',
        {
            lead_id: lead_id,
            remarks: remarks,
            remark_id
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


export function getPropertyType() {
    return api.get('/get-property-type',
        {
            headers: {
                Authorization: `Bearer ${store.getState().loginReducer.token}`
            }
        })
        .then(response => { return response.data.data })
        .catch((error) => {
            console.log(error)
        })
}

export function getSourceLead() {
    return api.get('/get-source-lead',
        {
            headers: {
                Authorization: `Bearer ${store.getState().loginReducer.token}`
            }
        })
        .then(response => { return response.data.data })
        .catch((error) => {
            console.log(error)
        })
}

export function setLeadStatus(type, lead_id, cancel_reason = '') {

    return api.put(`/state-as-${type}/${lead_id}`,
        {
            cancel_reason: cancel_reason
        },
        {
            headers: {
                Authorization: `Bearer ${store.getState().loginReducer.token}`
            }
        })
        .then(() => {
            Alert.alert("Update Lead", `Lead updated to ${type} status`);
        })
        .catch((error) => {
            console.log(error.response);
            Alert.alert("Update Lead Error", error.response.message);
        })
}