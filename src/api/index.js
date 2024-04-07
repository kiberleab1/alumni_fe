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
    config.headers.Authorization = 'Bearer dev';

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

export async function getRoles({ pageNumber, pageSize }) {
  const paging = { pageNumber, pageSize };
  return await axios.get(`${API_BASE_URl}/getAllRole`, paging);
}

export async function createNewRole({ role_name }) {
  const data = { role_name };
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

// export async function signin({
//   email,
//   first_name,
//   middle_name,
//   last_name,
//   phone_number,
//   password,
//   gender,
//   date_of_birth,
//   role_id,
//   address_id,
//   birth_place_id,
//   institute_id

// }) {
//   const data = {
//     email,
//     first_name,
//     middle_name,
//     last_name,
//     phone_number,
//     password,
//     gender,
//     date_of_birth,
//     role_id,
//     address_id,
//     birth_place_id,
//     institute_id
//   };
//   return await axios.post(`${API_BASE_URl}/signin`, data);
// }

export async function signup({
  email,
  first_name,
  middle_name,
  last_name,
  phone_number,
  password,
  gender,
  date_of_birth,
  role_id,
  address_id,
  birth_place_id,
  institute_id,
}) {
  const data = {
    email,
    first_name,
    middle_name,
    last_name,
    phone_number,
    password,
    gender,
    date_of_birth,
    role_id,
    address_id,
    birth_place_id,
    institute_id,
  };
  return await axios.post(`${API_BASE_URl}/signup`, data);
}
// export async function login({ email, password, ip_address }) {
//   const data = { email, password, ip_address };
//   return await axios.post(`${API_BASE_URl}/login`, loginData);
// }
export async function login({ email, password, ip_address }) {
  const data = {
    email,
    password,
    ip_address,
  };

  const response = await axios.post(`${API_BASE_URl}/login`, data);
  console.log(response);
  return response;
}
