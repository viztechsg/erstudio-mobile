import { Alert } from 'react-native'; // to show alerts in app
import api from '../api/api';
import { store } from '../store/store';
import moment from 'moment';

export function getProjectArea(project_id) {
    return api.get(`/project-area/${project_id}`, {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    })
        .then(response => {
            return response.data;
        })
        .catch(err => console.log(err));
}


export function addProjectArea(data) {
    const { project_id, area_id, free_area } = data;

    return api.post('/project-area/store',
        {
            project_id,
            area_id,
            free_area
        },
        {
            headers: {
                Authorization: `Bearer ${store.getState().loginReducer.token}`
            }
        })
        .then((data) => {
            console.log(data);
        })
        .catch((error) => {
            Alert.alert("Add Area Error", error.response.message);
            console.log(error.response);
        })
}

export function getProjectProgress(project_id, area_id,area_name) {
    return api.get(`/project-progress/${project_id}/${area_id}/${area_name}`, {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    })
        .then(response => {
            return response.data;
        })
        .catch(err => console.log(err.response));
}

export function addProjectProgress(data) {
    return api.post('project-progress/store',
        data
        ,
        {
            headers: {
                Authorization: `Bearer ${store.getState().loginReducer.token}`
            }
        })
        .then(() => {
            Alert.alert("Add project progress", "Success");
        })
        .catch((error) => {
            console.log(error.response)
        })
}

export function getProjectProgressPhoto(photo_id) {
    return api.get(`/project-progress-photo/${photo_id}`, {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    })
        .then(response => {
            return response.data;
        })
        .catch(err => console.log(err));
}

export function updateProjectProgress(data) {
    const {project_progress_id, project_progress_photo_id, image, remark, photo_remark, photo_capture_on} = data;
    return api.put(`/project-progress-photo/update`, {
        project_progress_id,
        project_progress_photo_id,
        image,
        remark,
        photo_remark,
        photo_capture_on
    }, {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    })
        .then(response => {
            console.log(response.data)
        })
        .catch(err => console.log(err.response.data.message));
}

export function deleteProjectProgressPhoto(id)
{
    return api.delete(`/project-progress-photo/delete/${id}`, {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    })
        .then(response => {
            return response.data.message;
        })
        .catch(err => console.log(err.response));
}