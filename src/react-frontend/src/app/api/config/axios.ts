import axios from 'axios';

export enum ApiException {
  ServerUnreachable = 0,
  Unknown = 1,
  Status500 = 500,
  Unauthorized = 401,
}

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  validateStatus: status => status >= 200 && status <= 400,
});

axiosInstance.interceptors.response.use(
  response => {
    if (process.env.NODE_ENV === 'development') {
      console.log(response.data);
    }

    return response;
  },
  error => {
    if (process.env.NODE_ENV === 'development') {
      console.log(error);
    }

    if (error?.message?.includes('Network Error')) {
      return Promise.reject(ApiException.ServerUnreachable);
    }

    if (error.response && error.response.status === 500) {
      return Promise.reject(ApiException.Status500);
    }

    if (error.response && error.response.status === 401) {
      return Promise.reject(ApiException.Unauthorized);
    }

    return Promise.reject(
      (error.response && error.response.data) || ApiException.Unknown,
    );
  },
);

export default axiosInstance;
