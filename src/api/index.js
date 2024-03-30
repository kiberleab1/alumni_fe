import axios from 'axios';

const API_BASE_URl = import.meta.env.VITE_BASE_URL;
axios.interceptors.response.use(
  (response) => {
    // console.log(response);
    return response;
  },
  (error) => {
    console.log(error);
    if (error.response.status === 401) {
      localStorage.removeItem('_user');
      // window.location.reload();
    }
    if (error?.request && !error?.response) {
      // connection failure
      // alert("Connection Error");
    }
    return Promise.reject(error);
  }
);

axios.interceptors.request.use(
  (config) => {
    try {
      //   const authToken = localStorage.getItem("authToken");
      //   console.log(authToken);
      //   if (authToken) {
      //     config.headers.Authorization = `Bearer ${authToken}`;
      //   }
    } catch (error) {
      console.log(error);
    }
    //TODO dev
    config.headers.Authorization = 'dev';

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export async function getUsers({ pageNumber, pageSize }) {
  const paging = { pageNumber, pageSize };
  return await axios.get(`${API_BASE_URl}/getDepartments`, paging);
}
