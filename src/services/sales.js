import { Alert } from 'react-native'; // to show alerts in app
import api from '../api/api';
import { store } from '../store/store';
import moment from 'moment';

export function getSingleProject(project_id) {
    return api.get(`/projects/${project_id}`, {
        headers: {
            Authorization: `Bearer ${store.getState().loginReducer.token}`
        }
    }) 
    .then( response => {
            return response.data.data.project;
    })
    .catch(err => console.log(err));
}

export function addProjectWorkSchedule(data)
{
    const { project_id, vendor_id, start_date, end_date, venue, scope_of_work,sow_id } = data;
    return api.post('/work-schedules',
    {
        project_id,
        vendor_id,
        venue,
        scope_of_work,
        start_date,
        end_date,
        sow_id
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