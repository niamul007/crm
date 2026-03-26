/**
 * axios.js — configured Axios instance
 * 
 * - baseURL pulled from .env (VITE_API_BASE_URL)
 * - Request interceptor automatically attaches JWT token
 *   to every request header so we don't repeat it manually
 *   in every API call
 */

import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
})

// Add a request interceptor to include the token in all requests
API.interceptors.request.use((config)=>{

    const token = localStorage.getItem("token");

    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }

    return config;
})

export default API;