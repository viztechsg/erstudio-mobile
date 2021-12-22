import api from '../api/api';
import { store } from '../store/store';

export function getProjectInspectionList(project_id,status = '') {
    return api.get(`/project-inspection/${project_id}?status=${status}`, {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    })
        .then(response => {
            return response.data.data.items;
        })
        .catch(err => console.log(err));
}

export function addProjectInspection(data) {

    return api.post('/project-inspection',
        data,
        {
            headers: {
                Authorization: `Bearer ${store.getState().loginReducer.token}`
            }
        })
        .then((data) => {
            console.log(data);
        })
        .catch((error) => {
            Alert.alert("Add Inspection Error", error.response.message);
            console.log(error.response);
        })
}

export function getSingleProjectInspection(project_inspection_id) {
    return api.get(`/project-inspection/show/${project_inspection_id}`, {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    })
        .then(response => {
            return response.data.data.item;
        })
        .catch(err => console.log(err));
}

export function updateProjectInspection(data, inspection_id) {
    return api.put(`/project-inspection/${inspection_id}`, data, {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    })
        .then(response => {
            console.log(response.data)
        })
        .catch(err => console.log(err.response.data.message));
}

export function addPIRemark(data) {

    return api.post('/project-inspection-remark',
        data,
        {
            headers: {
                Authorization: `Bearer ${store.getState().loginReducer.token}`
            }
        })
        .then((data) => {
            console.log(data);
        })
        .catch((error) => {
            Alert.alert("Add Remark Error", error.response.message);
            console.log(error.response);
        })
}

export function deletePIImage(id)
{
    return api.delete(`/project-inspection-image/${id}`, {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    })
        .then(response => {
            return response.data.message;
        })
        .catch(err => console.log(err));
}

export function addPIImage(data,project_inspection_id) {

    return api.post(`/project-inspection-image/store/${project_inspection_id}`,
        data,
        {
            headers: {
                Authorization: `Bearer ${store.getState().loginReducer.token}`
            }
        })
        .then((data) => {
            return data.data.message;
        })
        .catch((error) => {
            Alert.alert("Add image Error", error.response.message);
            console.log(error.response);
        })
}

