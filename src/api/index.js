// @ts-nocheck
import axios from "axios";
import { getUserToken } from "src/helpers/globalStorage";

const API_BASE_URl = import.meta.env.VITE_BASE_URL;
const IMAGE_API_URL = import.meta.env?.VITE_IMAGE_BASE_URL;
const BASE_URL = import.meta.env?.VITE_BASE_FE_URL;

axios.interceptors.request.use(
  (config) => {
    try {
      const { token, user } = getUserToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      config.headers.User = JSON.stringify(user);
    } catch (error) {
      //TODO dev
      // config.headers.Authorization = "Bearer dev";

      return config;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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

export async function getDepartments({ pageNumber, pageSize }) {
  return await axios.get(
    `${API_BASE_URl}/getDepartments?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
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

export async function deleteRole(role) {
  console.log(role);
  console.log(role.id);
  return await axios.get(`${API_BASE_URl}/deleteRole?id=${role.id}`);
}

export async function createDepartment(department) {
  console.log(department);
  return await axios.post(`${API_BASE_URl}/createDepartment`, department);
}

export async function editDepartent(department) {
  console.log(department);
  return await axios.put(`${API_BASE_URl}/updateDepartment`, department);
}

export async function deleteDepartment(department) {
  return await axios.get(
    `${API_BASE_URl}/deleteDepartment?id=${department.id}`
  );
}

export async function createInstitute(instituteData) {
  console.log(instituteData);

  return await axios.post(`${API_BASE_URl}/createInstitute`, instituteData);
}

export async function getInstitutes({ pageNumber, pageSize }) {
  try {
    const response = await axios({
      method: "GET",
      url: `${API_BASE_URl}/getAllInstitute?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching institutes:", error);
    throw error;
  }
}

export async function createEmailTemplates({ header, body }) {
  const data = { header, body };
  console.log(data);

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

export async function getAddressById(id) {
  try {
    const response = await axios({
      method: "GET",
      url: `${API_BASE_URl}/getAddressById?id=${id}`,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching address detail:", error);
    throw error;
  }
}

export async function getAllinstituteAdmins({ pageNumber, pageSize, value }) {
  try {
    const response = await axios({
      method: "GET",
      url: `${API_BASE_URl}/filterUsers?pageNumber=${pageNumber}&pageSize=${pageSize}&value=${value}&filterKeyword=role_id`,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching institutes admins:", error);
    throw error;
  }
}

export async function getRoleByName({ name }) {
  try {
    const response = await axios({
      method: "GET",
      url: `${API_BASE_URl}/getRoleByName?role_name=${name}`,
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response);
    console.log(name);
    return response;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
}

export async function createAInstituteAdmin(adminData) {
  console.log(adminData);
  return await axios.post(`${API_BASE_URl}/signup`, adminData);
}

export async function updateAddress(addressData) {
  console.log(addressData);
  return await axios.put(`${API_BASE_URl}/updateAddress`, addressData);
}

export async function updateInstitute(instituteData) {
  console.log(instituteData);
  return await axios.put(`${API_BASE_URl}/updateInstitute`, instituteData);
}

export async function deleteInstitute(instituteData) {
  console.log(instituteData);
  const response = await axios({
    method: "GET",
    url: `${API_BASE_URl}/deleteAddress?id=${instituteData.address_id}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response);

  return await axios.get(
    `${API_BASE_URl}/deleteInstitute?id=${instituteData.institute_id}`
  );
}

export async function updateAdmin(adminData) {
  console.log(adminData);
  return await axios.put(`${API_BASE_URl}/profileUpdate`, adminData);
}

export async function deleteAdmin(adminData) {
  // const addressDelete = await axios.get(
  //   `${API_BASE_URl}/deleteAddress?id=${adminData.address_id}`
  // );
  // const birthPlaceDelete = await axios.get(
  //   `${API_BASE_URl}/deleteAddress?id=${adminData.birth_place_id}`
  // );
  return await axios.get(`${API_BASE_URl}/deleteUser?id=${adminData.id}`);
}

export async function getAllEvents({ pageNumber, pageSize }) {
  try {
    return await axios.get(
      `${API_BASE_URl}/getAllEvents?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

export async function getInstituteEvents({ institute_id, max_count }) {
  try {
    return await axios.get(
      `${API_BASE_URl}/getInstituteEvents?max_count=${max_count}&institute_id=${institute_id}`
    );
  } catch (error) {
    console.log("Error fetching institute events ", error);
    throw error;
  }
}

export async function getEventById(event_id) {
  return await axios.get(`${API_BASE_URl}/getEventById?id=${event_id}`);
}

export async function createEvents(eventData) {
  console.log(eventData);

  const response = await axios.post(`${API_BASE_URl}/createEvent`, eventData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
}

export async function updateEvent(eventData) {
  console.log(eventData);
  const response = await axios.put(`${API_BASE_URl}/updateEvent`, eventData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
}

export async function deleteEvent(event_id) {
  console.log(event_id);
  return await axios.get(`${API_BASE_URl}/deleteEvents?id=${event_id}`);
}

export async function filterEvents() {}

export async function getEventsStatByDate(institute_id, max_count) {
  return await axios.get(
    `${API_BASE_URl}/getEventsStatByDate?institute_id=${institute_id}&max_count=${max_count}`
  );
}

export async function getAllNews({ pageNumber, pageSize }) {
  // try {
  return await axios.get(
    `${API_BASE_URl}/getAllNews?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
  // } catch (error) {
  //   console.error("Error fetching news:", error);
  //   throw error;
  // }
}

export async function createNews(newsData) {
  console.log(newsData);
  const response = await axios.post(`${API_BASE_URl}/createNews`, newsData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
}

export async function updateNews(newsData) {
  console.log(newsData);
  const response = await axios.put(`${API_BASE_URl}/updateNews`, newsData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
}

export async function deletedNews(news_id) {
  console.log(news_id);
  return await axios.get(`${API_BASE_URl}/deleteNews?id=${news_id}`);
}

export async function getNewsByID(news_id) {
  console.log(news_id);
  return await axios.get(`${API_BASE_URl}/getNewsById?id=${news_id}`);
}

//permission

export async function getAllPremissions({ pageNumber, pageSize }) {
  console.log(pageNumber, pageSize);
  const result = await axios.get(
    `${API_BASE_URl}/getAllPermission?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
  return result;
}

export async function getPermissionById(permission_id) {
  const result = await axios.get(
    `${API_BASE_URl}/getPermissionById?id=${permission_id}`
  );
  return result;
}

export async function createPermission(permissionData) {
  console.log(permissionData);
  const result = axios.post(`${API_BASE_URl}/createPermission`, permissionData);
  console.log(result);
  return result;
}

export async function deletePermission(permissionData) {
  console.log(permissionData);
  // const result = await axios.get(`${API_BASE_URl}/deletePermission?id=${permission_id}`);
  // console.log(result)
  // return result;
  return await axios.get(
    `${API_BASE_URl}/deletePermission?id=${permissionData.id}`
  );
}

export async function updatePermission(permissionData) {
  console.log(permissionData);
  const result = await axios.put(
    `${API_BASE_URl}/updatePermission`,
    permissionData
  );
  return result;
}

// jobs

export async function getAllJobs({ pageNumber, pageSize }) {
  const result = await axios.get(
    `${API_BASE_URl}/getAllJobs?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
  return result;
}

export async function createJob(jobData) {
  console.log(jobData);
  const response = await axios.post(`${API_BASE_URl}/createJob`, jobData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
}

export async function updateJob(jobData) {
  console.log(jobData);
  const response = await axios.put(`${API_BASE_URl}/updateJob`, jobData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
}

export async function deleteJob(jobs_id) {
  console.log(jobs_id);
  return await axios.get(`${API_BASE_URl}/deleteJob?id=${jobs_id}`);
}

// staff

export async function getAllStaff({ pageNumber, pageSize }) {
  const result = await axios.get(
    `${API_BASE_URl}/getAllStaff?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
  return result;
}

export async function createStaff(staffData) {
  console.log(staffData);
  return await axios.post(`${API_BASE_URl}/createStaff`, staffData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function updateStaff(staffData) {
  console.log(staffData);
  return await axios.put(`${API_BASE_URl}/updateStaff`, staffData);
}

export async function deleteStaff(staffData) {
  // const addressDelete = await axios.get(
  //   `${API_BASE_URl}/deleteAddress?id=${staffData.address_id}`
  // );

  return await axios.get(`${API_BASE_URl}/deleteStaff?id=${staffData.id}`);
}

// job history

export async function getAllJobHistory({ pageNumber, pageSize }) {
  const result = await axios.get(
    `${API_BASE_URl}/getAllJobHistory?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
  return result;
}

export async function createJobHistory(jobHistoryData) {
  console.log(jobHistoryData);
  return await axios.post(`${API_BASE_URl}/createJobHistory`, jobHistoryData);
}

export async function updateJobHistory(jobHistoryData) {
  console.log(jobHistoryData);
  return await axios.put(`${API_BASE_URl}/updateJobHistory`, jobHistoryData);
}

export async function deleteJobHistory(jobHistoryData) {
  return await axios.get(
    `${API_BASE_URl}/deleteJobHistory?id=${jobHistoryData.id}`
  );
}

export async function createWebContent({
  component,
  title,
  description,
  images,
}) {
  const formData = new FormData();
  images.forEach((file) => {
    formData.append("images", file);
  });
  formData.append("component", component);
  formData.append("title", title);
  formData.append("description", description);

  return await axios.post(`${API_BASE_URl}/createWebContent`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function getWebContentByComonent({ component }) {
  const data = { component, pageNumber: 1, pageSize: 1 };
  return await axios.post(`${API_BASE_URl}/getWebContentByComponent`, data);
}

export function getImageBaseUrl(link) {
  return IMAGE_API_URL + "/" + link;
}

export function buildNewsUrl(id) {
  const url = BASE_URL + `landing/content?type=news&id=${id}`;
  console.log({ url });
  return url;
}
export function buildEventsUrl(id) {
  const url = BASE_URL + `landing/content?type=events&id=${id}`;
  console.log({ url });
  return url;
}

export async function getAllAlumni({ pageNumber, pageSize }) {
  const result = await axios.get(
    `${API_BASE_URl}/getAllAlumniProfile?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
  return result;
}

export async function getAllVerificationRequest({ pageNumber, pageSize }) {
  const result = await axios.get(
    `${API_BASE_URl}/getAllVerificationRequest?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
  return result;
}

export async function createAlumniProfile(alumni) {
  console.log(alumni);
  return await axios.post(`${API_BASE_URl}/createAlumniProfile`, alumni);
}

export async function createSettings(settings) {
  const response = await axios.post(`${API_BASE_URl}/createSetting`, settings, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
}

export async function getAllSettings({ pageNumber, pageSize }) {
  const result = await axios.get(
    `${API_BASE_URl}/getAllSettings?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
  return result;
}

export async function createPodcast({ name, description, url }) {
  const data = { title: name, description, url };
  const result = await axios.post(`${API_BASE_URl}/createPodcast`, data);
  return result;
}

export async function getAllPodcast({ pageNumber, pageSize }) {
  const data = { pageNumber, pageSize };
  const result = await axios.post(`${API_BASE_URl}/getAllPodcast`, data);
  return result;
}

export async function updatePodcast({ id, name, description, url }) {
  const data = { id, title: name, description, url };
  const result = await axios.post(`${API_BASE_URl}/updatePodcast`, data);
  return result;
}

export async function deletePodcast({ id }) {
  const data = { id };
  const result = await axios.post(`${API_BASE_URl}/deletePodcast`, data);
  return result;
}
