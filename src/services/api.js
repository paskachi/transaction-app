import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Replace with your computer's IP if testing on a device

let token = null;

export const setToken = (newToken) => {
    token = newToken;
};

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// API functions
export const login = (username, password) =>
    api.post('/login', { username, password });

export const getTransactions = () =>
    api.get('/transactions');

export const addTransaction = (date, amount, description) =>
    api.post('/transactions', { date, amount, description });
