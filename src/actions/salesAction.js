import { Alert } from 'react-native'; // to show alerts in app
import api from '../api/api';
import { store } from '../store/store';
import moment from 'moment';

export function getSalesData(status = '', start_date = '', end_date = '') {
    return (dispatch) => {

        api.get(`/projects?status=${status}&start_date=${start_date}&end_date=${end_date}`, {
            headers: {
                Authorization: `Bearer ${store.getState().loginReducer.token}`
            }
        })
            .then((data) => {
                dispatch(setDataState(data.data.data.items));
            })
            .catch((error) => {
                console.log(error.response);
                return {
                    type: "SET_ERROR_DATE_STATE_SALES",
                    payload: error
                }
            })
    }
}

export function resetData() {
    return (dispatch) => {
        return {
            type: "RESET_DATA_SALES",
        }
    }
}

export function createSalesProject(params) {
    const { leadID, clientName, email, phoneNumber, propertyType, postalCode, roadName, roadNo, residence, projectStart, blockNo, budget } = params;
    return (dispatch) => {
        api.post('/projects',
            {
                lead_id: leadID,
                source_id: 1,
                client_name: clientName,
                email: email,
                property_type_id: propertyType,
                project_start: projectStart,
                contact_number : phoneNumber,
                road_no : roadNo,
                road_name : roadName,
                residence : residence,
                block_no : blockNo,
                postal_code : postalCode,
                budget : budget,
                project_code : "AAR-309929",
                ic_number : "SGB99834890"
            },
            {
                headers: {
                    Authorization: `Bearer ${store.getState().loginReducer.token}`
                }
            })
            .then((data) => {
                Alert.alert("Create Project", data.data.message);
            })
            .catch((error) => {
                console.log(error.response)
                Alert.alert("Create Project Error", error.response.message);
                return {
                    type: "SET_ERROR_DATE_STATE",
                    payload: error
                }
            })
    }
}

export function updateSalesProject(params,project_id) {
    const { clientName, email, phoneNumber, propertyType, postalCode, roadName, roadNo, residence, projectStart, blockNo } = params;
    return (dispatch) => {
        api.put(`/projects/${project_id}`,
            {
                source_id: 1,
                client_name: clientName,
                email: email,
                property_type_id: propertyType,
                project_start: projectStart,
                contact_number : phoneNumber,
                road_no : roadNo,
                road_name : roadName,
                residence : residence,
                block_no : blockNo,
                postal_code : postalCode,
                budget: "90000"
            },
            {
                headers: {
                    Authorization: `Bearer ${store.getState().loginReducer.token}`
                }
            })
            .then((data) => {
                Alert.alert("Update Project", "Success");
            })
            .catch((error) => {
                Alert.alert("Update Project Error", error.response.message);
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
        type: "SET_DATA_STATE_SALES",
        payload: data,
    };
};