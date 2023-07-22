import a, { CanceledError } from 'axios';

const axios = a.create({ baseURL: `/api` });

axios.interceptors.response.use(
  (response) => response.data,
  (err) => {
    if (err instanceof CanceledError) {
      return Promise.reject(err);
    }

    return Promise.reject(err);
  }
);

export default axios;
