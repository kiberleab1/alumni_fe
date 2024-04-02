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
export async function getDepartments({ pageNumber, pageSize }) {
  const paging = { pageNumber, pageSize };
  return await axios.get(`${API_BASE_URl}/getDepartments`, paging);
}

export async function createDepartment({ name, description, contact_info }) {
  const data = { name, description, contact_info };
  console.log(data);
  return await axios.post(`${API_BASE_URl}/createDepartment`, data);
}

export async function createInstitute({
  name,
  description,
  contact_info,
  address_id,
  starting_year,
}) {
  const data = {
    name,
    description,
    address_id,
    starting_year,
    contact_info,
  };
  return await axios.post(`${API_BASE_URl}/createInstitute`, data);
}

export async function getInstitutes({ pageNumber, pageSize }) {
  const paging = { pageNumber, pageSize };
  return await axios.get(`${API_BASE_URl}/getAllInstitute`, paging);
}

export async function createEmailTemplates({ header, body }) {
  const data = { header, body };
  return await axios.post(`${API_BASE_URl}/emailsTemplates`, data);
}

export async function fetchEmailTemplates({ pageNumber, pageSize }) {
  const paging = { count: pageSize, page: pageNumber };
  console.log('here', paging);
  return await axios.post(`${API_BASE_URl}/getEmailTemplates`, paging);
}
// header: joi.string().required(),
// body: joi.string().required(),
