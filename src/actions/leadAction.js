import { Alert } from 'react-native'; // to show alerts in app
import api from '../api/api';
import { store } from '../store/store';
import moment from 'moment';

export function getLeadData(status = '', start_date = '', end_date = '', salesman_id = '', need_attention = '') {
    return (dispatch) => {

        api.get(`/leads?status=${status}&start_date=${start_date}&end_date=${end_date}&salesman_id=${salesman_id}&need_attention=${need_attention}`, {
            headers: {
                Authorization: `Bearer ${store.getState().loginReducer.token}`
            }
        })
            .then((data) => {
                dispatch(setDataState(data.data.data.lead));
            })
            .catch((error) => {
                return {
                    type: "SET_ERROR_DATE_STATE",
                    payload: error
                }
            })
    }
}

export function resetData() {
    return (dispatch) => {
        return {
            type: "RESET_DATA",
        }
    }
}

export function createLead(params) {
    const {
        clientName,
        email,
        phoneNumber,
        propertyType,
        status,
        sourceLead,
        postalCode,
        roadName,
        roadNo,
        residence,
        blockNo,
        selectedAssign,
        budget,
        remarks,
        conditionType,
        moveInDate,
        normal_option_source,
        normal_option_ref_notes,
        memo,
        salutation,
        country_code
    } = params;

    return (dispatch) => {
        api.post('/leads',
            {
                user_id: 1,
                client_name: clientName,
                email: email,
                contact_number: phoneNumber,
                enter_date: moment(),
                postal_code: postalCode,
                road_name: roadName,
                road_no: roadNo,
                property_type: propertyType,
                status: status,
                source: sourceLead,
                condition_type: conditionType,
                budget: budget,
                residence: residence,
                block_no: blockNo,
                salesman_id: selectedAssign,
                remarks: remarks,
                move_in_date: moveInDate,
                normal_option_source,
                normal_option_ref_notes,
                memo,
                salutation,
                country_code

            },
            {
                headers: {
                    Authorization: `Bearer ${store.getState().loginReducer.token}`
                }
            })
            .then((data) => {
                Alert.alert("Create Lead", "Success");
            })
            .catch((error) => {
                Alert.alert("Create Lead Error", error.response.message);
                console.log(error.response);
                return {
                    type: "SET_ERROR_DATE_STATE",
                    payload: error
                }
            })
    }
}

export function updateLEad(params, lead_id) {
    const { clientName, email, phoneNumber, propertyType, status, sourceLead, postalCode, roadName, roadNo, residence, blockNo, salesId, budget, conditionType, moveInDate, normal_option_source, normal_option_ref_notes, memo, salutation, country_code  } = params;
    return (dispatch) => {
        api.put(`/leads/${lead_id}`,
            {
                user_id: 1,
                client_name: clientName,
                email: email,
                contact_number: phoneNumber,
                // enter_date: moment(),
                postal_code: postalCode,
                road_name: roadName,
                road_no: roadNo,
                property_type: propertyType,
                status: status,
                salesman_id: salesId,
                source: sourceLead,
                condition_type: conditionType,
                residence,
                block_no: blockNo,
                budget: budget,
                move_in_date: moveInDate,
                normal_option_source, 
                normal_option_ref_notes,
                memo,
                salutation,
                country_code
            },
            {
                headers: {
                    Authorization: `Bearer ${store.getState().loginReducer.token}`
                }
            })
            .then((data) => {
                Alert.alert("Update Lead", "Success");
            })
            .catch((error) => {
                Alert.alert("Create Lead Error", error.response.message);
                console.log(error.response);
                return {
                    type: "SET_ERROR_DATE_STATE",
                    payload: error
                }
            })
    }
}

export function deleteLead(id) {
    return (dispatch) => {
        api.delete(`/leads/${id}`, {
            headers: {
                Authorization: `Bearer ${store.getState().loginReducer.token}`
            },
            data: {
                id: id
            }
        })
            .then(() => {
                Alert.alert("Delete Lead", "Success");
                dispatch({
                    type: 'DELETE_LEAD'
                })
            })
            .catch((error) => {
                console.log(error)
                Alert.alert("Delete Lead Error", "Can't delete this Lead");
            })
    }
}

const setDataState = (data) => {
    return {
        type: "SET_DATA_STATE",
        payload: data,
    };
};