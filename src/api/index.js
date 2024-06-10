import axios from 'axios';
import { func } from 'prop-types';

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

export async function getRoles({pageNumber, pageSize}) {
  const paging = { pageNumber, pageSize };
  return await axios.get(`${API_BASE_URl}/getAllRole`, paging);
}

export async function createNewRole({role_name}) {
  const data = {role_name}
  console.log(data);
  return await axios.post(`${API_BASE_URl}/createRole`, data);
}

export async function createDepartment({ name, description, contact_info }) {
  const data = { name, description, contact_info };
  console.log(data);
  return await axios.post(`${API_BASE_URl}/createDepartment`, data);
}

export async function createInstitute({
  name,
  description,
  address_id,
  starting_year,
  contact_info,
}) {
  const data = {
    name,
    description,
    address_id,
    starting_year,
    contact_info,
  };
  console.log(data)

  return await axios.post(`${API_BASE_URl}/createInstitute`, data);
}

export async function getInstitutes({ pageNumber, pageSize }) {
  try {
    const response = await axios({
      method: 'GET',
      url: `${API_BASE_URl}/getAllInstitute?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching institutes:', error);
    throw error;
  }
}

export async function createAddress({country, region, city, houseNumber}) {
  const data = {
    country,
    region,
    city,
    houseNumber
  };
  console.log(data)
  return await axios.post(`${API_BASE_URl}/createAddress`, data);
}

export async function getAddressById(id) {
  try {
    const response = await axios({
      method: 'GET',
      url: `${API_BASE_URl}/getAddressById?id=${id}`,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching address detail:', error);
    throw error;
  }
}


export async function getAllinstituteAdmins({ pageNumber, pageSize,value }) {
  try {
    const response = await axios({
      method: 'GET',
      url: `${API_BASE_URl}/filterUsers?pageNumber=${pageNumber}&pageSize=${pageSize}&value=${value}&filterKeyword=role_id`,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching institutes admins:', error);
    throw error;
  }
}

export async function getRoleByName({name}) {
  try {
    const response = await axios({
      method: 'GET',
      url: `${API_BASE_URl}/getRoleByName?role_name=${name}`,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log(response)
    console.log(name)
    return response;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
}

export async function createAInstituteAdmin(adminData) {
  console.log(adminData)
  return await axios.post(`${API_BASE_URl}/signup`, adminData);
}
