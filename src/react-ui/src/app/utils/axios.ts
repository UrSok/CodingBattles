import axios from 'axios';
import { ApiException } from './types/api';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  validateStatus: status => status >= 200 && status <= 400,
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (process.env.NODE_ENV === 'development') {
      console.log(error);
    }

    if (error.includes('Network Error')) {
      return Promise.reject(ApiException.ServerUnreachable);
    }

    if (error.response && error.response.status === 500) {
      return Promise.reject(error.response || ApiException.Status500);
    }

    return Promise.reject(
      (error.response && error.response.data) || ApiException.Unknown,
    );
  },
);

export default axiosInstance;
