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
    const { project_id, vendor_id, start_date, end_date, venue, scope_of_work } = data;
    return api.post('/work-schedules',
    {
        project_id,
        vendor_id,
        venue,
        scope_of_work,
        start_date,
        end_date
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