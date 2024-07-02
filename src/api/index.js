// @ts-nocheck
import axios from "axios";

const API_BASE_URl = import.meta.env.VITE_BASE_URL;
axios.interceptors.response.use(
  (response) => {
    // console.log(response);
    return response;
  },
  (error) => {
    console.log(error);
    if (error.response.status === 401) {
      localStorage.removeItem("_user");
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
    config.headers.Authorization = "Bearer dev";

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
  console.log(data);

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
  console.log("here", paging);
  return await axios.post(`${API_BASE_URl}/getEmailTemplates`, paging);
}
// header: joi.string().required(),
// body: joi.string().required(),
export async function createAddress({ country, region, city, houseNumber }) {
  const data = {
    country,
    region,
    city,
    houseNumber,
  };
  console.log(data);
  return await axios.post(`${API_BASE_URl}/createAddress`, data);
}
export async function getEmailFetchingOptions() {
  const departments = await getDepartments({ pageNumber: 1, pageSize: 10 });
  const institutions = await getInstitutes({ pageNumber: 1, pageSize: 10 });
  const allFetchingOptions = {
    departments: departments.data.department,
    institutions: institutions.data.institute,
  };
  console.log({ allFetchingOptions });
  return allFetchingOptions;
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

export async function sendEmail({
  email_template_id,
  email_filtering_options: {
    option_type,
    option_value,
    email_blast_option = "one_time",
  },
}) {
  const data = {
    email_template_id,
    email_filtering_options: {
      option_type,
      option_value,
      email_blast_option,
    },
  };
  const response = await axios.post(`${API_BASE_URl}/sendEmails`, data);
  return response;
}

// email_template_id: joi.string().required(),
// email_filtering_options: joi
//   .object({
//     option_type: joi
//       .string()
//       .valid(...EMAIL_FILTERING_OPTIONS_CONST)
//       .required(),
//     option_value: joi.string().required(),
//     email_blast_option: joi
//       .string()
//       .valid(...email_blast_options)
//       .default('one_time'),
//   })
