import axios from "axios";
import { store } from "../store/store";
import { setLoading } from "../store/slice/loadingSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  headers: {
    "Content-Type": "application/json",
  },
});

let activeRequests = 0;

api.interceptors.request.use(
  (config) => {
    // ✅ Ignora le richieste OPTIONS (preflight CORS)
    if (config.method?.toUpperCase() === 'OPTIONS') {
      return config;
    }
    
    activeRequests++;
    store.dispatch(setLoading(true));
    return config;
  },
  (error) => {
    activeRequests = Math.max(activeRequests - 1, 0);
    if (activeRequests === 0) store.dispatch(setLoading(false));
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // ✅ Ignora le risposte OPTIONS
    if (response.config.method?.toUpperCase() === 'OPTIONS') {
      return response;
    }
    
    activeRequests = Math.max(activeRequests - 1, 0);
    if (activeRequests === 0) store.dispatch(setLoading(false));
    return response;
  },
  (error) => {
    activeRequests = Math.max(activeRequests - 1, 0);
    if (activeRequests === 0) store.dispatch(setLoading(false));
    return Promise.reject(error);
  }
);

export default api;