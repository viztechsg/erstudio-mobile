import { Alert } from 'react-native';
import api from '../api/api';
import { store } from '../store/store';

export function getProjectDefectList(project_id,status = '',category = '',sow_id = '') {
    return api.get(`/project-defect/${project_id}?status=${status}&category=${category}&sow_id=${sow_id}`, {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    })
        .then(response => {
            return response.data.data.items;
        })
        .catch(err => console.log(err));
}

export function addProjectDefect(data) {

    return api.post('/project-defect',
        data,
        {
            headers: {
                Authorization: `Bearer ${store.getState().loginReducer.token}`
            }
        })
        .then((v) => {
            return v;
        })
        .catch((error) => {
            Alert.alert("Add Defect Error", "Error");
            console.log(error.response);
        })
}

export function getSingleProjectDefect(project_defect_id) {
    return api.get(`/project-defect/show/${project_defect_id}`, {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    })
        .then(response => {
            return response.data.data.item;
        })
        .catch(err => console.log(err));
}

export function updateProjectDefect(data, defect_id) {
    return api.put(`/project-defect/${defect_id}`, data, {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    })
        .then(response => {
            console.log(response.data)
        })
        .catch(err => console.log(err.response.data.message));
}

export function addPDRemark(data) {

    return api.post('/project-defect-remark',
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

export function deletePDImage(id)
{
    return api.delete(`/project-defect-image/${id}`, {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    })
        .then(response => {
            return response.data.message;
        })
        .catch(err => console.log(err));
}

export function addPDImage(data,project_defect_id) {

    return api.post(`/project-defect-image/store/${project_defect_id}`,
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

export function addProjectVendorList(data) {

    return api.post(`/project-defect-vendor-create`,
        data,
        {
            headers: {
                Authorization: `Bearer ${store.getState().loginReducer.token}`
            }
        })
        .then((data) => {
            Alert.alert("Add Vendor", data.data.message);
            return data.data;
        })
        .catch((error) => {
            Alert.alert("Add vendor Error", error.response.message);
            console.log(error.response);
        })
}

export function getProjectVendorList(project_id,sow_id) {
    return api.get(`/get-vendor-by-sow/${project_id}/${sow_id}`, {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    })
        .then(response => {
            return response.data.data;
        })
        .catch(err => console.log(err));
}

export function getVendorByProject(project_id) {
    return api.get(`/get-vendor-project/${project_id}`, {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    })
        .then(response => {
            return response.data.data;
        })
        .catch(err => console.log(err));
}

export function deleteDefect(id)
{
    return api.delete(`project-defect/${id}`, {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    })
        .then(response => {
            return response.data.message;
        })
        .catch(err => console.log(err.response));
}