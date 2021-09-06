import axios from 'axios';
import { API_V1_URL } from '../constants/URL';

export default axios.create({
    baseURL: API_V1_URL,
    headers:{
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});