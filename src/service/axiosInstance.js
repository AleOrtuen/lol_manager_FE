import axios from "axios";
import { store } from "../store/store";
import { setLoading } from "../store/slice/loadingSlice";


// ✅ Crea un'istanza Axios personalizzata
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Contatore richieste attive (per evitare di nascondere il loader troppo presto)
let activeRequests = 0;

// 👉 Interceptor per richieste in partenza
api.interceptors.request.use(
  (config) => {
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

// 👉 Interceptor per risposte completate
api.interceptors.response.use(
  (response) => {
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
