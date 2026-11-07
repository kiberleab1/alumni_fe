// @ts-nocheck
import axios from "axios";
import { getUserToken } from "src/helpers/globalStorage";

const HTTP_CODES = {
  OK: 200,
  CREATED: 201,
  DELETED: 204,
  BAD_REQUEST: 400,
  PROHIBITED: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_REQUEST: 422,
  INTERNAL_SERVER_ERROR: 500,
  UNAUTHORIZED: 401,
};
const API_BASE_URl = import.meta.env.VITE_BASE_URL;
const IMAGE_API_URL = import.meta.env?.VITE_IMAGE_BASE_URL;
const BASE_URL = window.location.origin + "/";

const INSTITUTE_SLUG = import.meta.env?.VITE_INSTITUTE_SLUG;

axios.interceptors.request.use(
  (config) => {
    // NB: the whole user object used to be sent in a "User" header on every
    // request – leaking PII and breaking on non-ASCII names. Only the bearer
    // token is needed; the server resolves identity and role itself.
    const stored = getUserToken();
    if (stored?.token) {
      config.headers.Authorization = `Bearer ${stored.token}`;
    }
    if (INSTITUTE_SLUG) config.headers["X-Institute-Slug"] = INSTITUTE_SLUG;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    // console.log(response);
    if (
      response.status === HTTP_CODES.OK ||
      response.status === HTTP_CODES.CREATED ||
      response.status === HTTP_CODES.DELETED
    ) {
      return response;
    }
    return Promise.reject(response);
  },
  (error) => {
    const status = error?.response?.status;
    const code = error?.response?.data?.error?.code;
    // session is gone (expired / logged out elsewhere / account suspended):
    // clear it and send the user to the login page once.
    const SESSION_CODES = ["TOKEN_EXPIRED", "TOKEN_INVALID", "SESSION_REVOKED", "TOKEN_MISSING"];
    if ((status === 401 && SESSION_CODES.includes(code)) || (status === 403 && code?.startsWith("ACCOUNT_"))) {
      if (getUserToken()) {
        localStorage.removeItem("userData");
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login?expired=1";
        }
      }
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
  return response;
}

/* account recovery: links in these e-mails point at the pages in pages/auth */
export async function requestPasswordReset(email) {
  return (await axios.post(`${API_BASE_URl}/passwordRecover`, { email })).data;
}
export async function resetPasswordWithToken({ token, new_password }) {
  return (await axios.post(`${API_BASE_URl}/passwordReset`, { token, new_password })).data;
}
export async function verifyEmailToken(token) {
  return (await axios.post(`${API_BASE_URl}/verify-email`, { token })).data;
}
export async function acceptInvite({ token, new_password }) {
  return (await axios.post(`${API_BASE_URl}/accept-invite`, { token, new_password })).data;
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

export async function filterEvents({ pageNumber, pageSize, keyword, value }) {
  try {
    return await axios.get(
      `${API_BASE_URl}/filterEvents?pageNumber=${pageNumber}&pageSize=${pageSize}&filterKeyword=${keyword}&value=${value}`
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

export async function getWebContentByComonent({
  component,
  pageNumber,
  pageSize,
}) {
  const data = { component, pageNumber, pageSize };
  return await axios.post(`${API_BASE_URl}/getWebContentByComponent`, data);
}

export async function deleteWebContentById({ id }) {
  const data = { id };
  return await axios.post(`${API_BASE_URl}/deleteWebContent`, data);
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

/** no id: the signed-in member's own profile */
export async function getAlumniProfileById(user_id) {
  const result = await axios.get(
    `${API_BASE_URl}/getAlumniProfileById${user_id ? `?id=${user_id}` : ""}`
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
  const response = await axios.post(
    `${API_BASE_URl}/createAlumniProfile`,
    alumni,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response;
}

export async function updateAlumniProfile(alumni) {
  console.log(alumni);
  return await axios.put(`${API_BASE_URl}/updateAlumniProfile`, alumni, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
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

export async function getAllTestimonial({ pageNumber, pageSize }) {
  const data = { pageNumber, pageSize };
  const result = await axios.post(`${API_BASE_URl}/getAllTestimonial`, data);
  return result;
}

export async function deleteTestimonial({ id }) {
  const data = { id };
  const result = await axios.post(`${API_BASE_URl}/deleteTestimony`, data);
  return result;
}

export async function createTestimonial({ full_name, credentials, testimony }) {
  const data = { full_name, credentials, testimony };
  const result = await axios.post(`${API_BASE_URl}/createTestimony`, data);
  return result;
}
export async function updateTestimonial({
  id,
  full_name,
  credentials,
  testimony,
}) {
  const data = { id, full_name, credentials, testimony };
  const result = await axios.post(`${API_BASE_URl}/updateTestimony`, data);

  return result;
}
export async function filterAlumniProfile({
  pageNumber,
  pageSize,
  filterKeyword,
  value,
}) {
  console.log(pageNumber, pageSize, filterKeyword, value);
  const result = await axios.get(
    `${API_BASE_URl}/filterAlumniProfile?pageNumber=${pageNumber}&pageSize=${pageSize}&filterKeyword=${filterKeyword}&value=${value}`
  );
  return result;
}

export async function requestConnection(requesting_user_id) {
  const data = { user_id: requesting_user_id };
  console.log(data);
  return await axios.post(`${API_BASE_URl}/createConnection`, data);
}

export async function myConnectionRequests({
  pageNumber,
  pageSize,
  filterKeyword,
  value,
}) {
  console.log(pageNumber, pageSize, filterKeyword, value);
  const result = await axios.get(`${API_BASE_URl}/filterConnection?pageNumber=${pageNumber}&pageSize=${pageSize}&filterKeyword=${filterKeyword}&value=${value}`);
  return result;
}

export async function updateConnection(data) {
  console.log(data);
  return await axios.put(`${API_BASE_URl}/updateConnection`, data);
}

export async function getChatHistory({from_user_id, to_user_id}){
  console.log(from_user_id, to_user_id);
  const result = await axios.get(`${API_BASE_URl}/chat/history?from_user_id=${from_user_id}&to_user_id=${to_user_id}`);
  return result;
}

export async function sendFiles(messageData) {
  console.log(messageData);
  const response = await axios.post(`${API_BASE_URl}/chat/sendFiles`, messageData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
}

/* ------------------------------------------------------------------ */
/* Shared helpers                                                       */
/* ------------------------------------------------------------------ */

/** Human-readable message from any API error (new and legacy shapes). */
export function apiErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  const data = error?.response?.data;
  if (!error?.response) return "Can't reach the server. Check your connection.";
  return data?.error?.message || data?.message || (typeof data === "string" && data) || fallback;
}

export const API_ORIGIN = (() => {
  try {
    return new URL(API_BASE_URl).origin;
  } catch {
    return window.location.origin;
  }
})();

/* ------------------------------------------------------------------ */
/* Account                                                              */
/* ------------------------------------------------------------------ */
export async function getMe() {
  return (await axios.get(`${API_BASE_URl}/me`)).data.data;
}
export async function logout() {
  try {
    await axios.post(`${API_BASE_URl}/logout`);
  } catch {
    /* already logged out server-side */
  }
}

/* ------------------------------------------------------------------ */
/* Connections                                                          */
/* ------------------------------------------------------------------ */
// type: accepted | incoming | outgoing
export async function listConnections({ type = "accepted", search = "", pageNumber = 1, pageSize = 20 }) {
  const params = new URLSearchParams({ type, search, pageNumber, pageSize });
  return (await axios.get(`${API_BASE_URl}/connections?${params}`)).data;
}
export async function getConnectionCounts() {
  return (await axios.get(`${API_BASE_URl}/connections/counts`)).data.data;
}
export async function getConnectionStatus(user_id) {
  return (await axios.get(`${API_BASE_URl}/connections/status?user_id=${user_id}`)).data.data;
}
export async function getConnectionSuggestions(limit = 12) {
  return (await axios.get(`${API_BASE_URl}/connections/suggestions?limit=${limit}`)).data.items;
}
export async function sendConnectionRequest({ user_id, message }) {
  return (await axios.post(`${API_BASE_URl}/connections`, { user_id, message })).data.data;
}
// status: accepted | declined | cancelled
export async function respondToConnection({ id, status }) {
  return (await axios.patch(`${API_BASE_URl}/connections/${id}`, { status })).data.data;
}
export async function removeConnection({ id, user_id }) {
  const url = id ? `${API_BASE_URl}/connections/${id}` : `${API_BASE_URl}/connections?user_id=${user_id}`;
  return (await axios.delete(url)).data.data;
}

/* ------------------------------------------------------------------ */
/* Chat                                                                 */
/* ------------------------------------------------------------------ */
export async function getConversations() {
  return (await axios.get(`${API_BASE_URl}/chat/conversations`)).data;
}
export async function getMessages({ peerId, before, limit = 30 }) {
  const params = new URLSearchParams({ with: peerId, limit });
  if (before) params.set("before", before);
  return (await axios.get(`${API_BASE_URl}/chat/history?${params}`)).data;
}
export async function markChatRead(peer_id) {
  return (await axios.post(`${API_BASE_URl}/chat/read`, { peer_id })).data.data;
}
export async function sendChatMessageHttp({ to, text, client_id, reply_to }) {
  return (await axios.post(`${API_BASE_URl}/chat/messages`, { to, text, client_id, reply_to })).data.data;
}
export async function deleteChatMessage(id) {
  return (await axios.delete(`${API_BASE_URl}/chat/messages/${id}`)).data.data;
}
export async function getChatUnreadCount() {
  return (await axios.get(`${API_BASE_URl}/chat/unread-count`)).data.data.unread;
}
/** Upload attachments; the server stores one message and pushes it to both sides. */
export async function uploadChatFiles({ to, files, text, client_id, reply_to, onProgress }) {
  const form = new FormData();
  form.append("to_user_id", to);
  if (text) form.append("text", text);
  if (client_id) form.append("client_id", client_id);
  if (reply_to) form.append("reply_to", reply_to);
  files.forEach((f) => form.append("files", f));
  const res = await axios.post(`${API_BASE_URl}/chat/sendFiles?to_user_id=${to}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) => onProgress && e.total && onProgress(Math.round((e.loaded / e.total) * 100)),
  });
  return res.data.data;
}

/* ------------------------------------------------------------------ */
/* Notifications                                                        */
/* ------------------------------------------------------------------ */
export async function getNotifications({ pageNumber = 1, pageSize = 20 } = {}) {
  return (await axios.get(`${API_BASE_URl}/notifications?pageNumber=${pageNumber}&pageSize=${pageSize}`)).data;
}
export async function markNotificationsRead({ ids, all }) {
  return (await axios.post(`${API_BASE_URl}/notifications/read`, { ids, all })).data.data;
}

/* ------------------------------------------------------------------ */
/* Event RSVP                                                           */
/* ------------------------------------------------------------------ */
export async function getEventAttendance(eventId) {
  return (await axios.get(`${API_BASE_URl}/events/${eventId}/attendance`)).data.data;
}
/** status: "going" | "maybe" | "not_going" → updated attendance summary */
export async function setEventRsvp({ eventId, status }) {
  return (await axios.put(`${API_BASE_URl}/events/${eventId}/rsvp`, { status })).data.data;
}
export async function clearEventRsvp(eventId) {
  return (await axios.delete(`${API_BASE_URl}/events/${eventId}/rsvp`)).data.data;
}
export async function getEventAttendees({ eventId, status = "going", scope = "all", search = "", pageNumber = 1, pageSize = 24 }) {
  const q = new URLSearchParams({ status, scope, search, pageNumber, pageSize });
  return (await axios.get(`${API_BASE_URl}/events/${eventId}/attendees?${q}`)).data;
}
export async function getMyEvents(when = "upcoming") {
  return (await axios.get(`${API_BASE_URl}/me/events?when=${when}`)).data.data;
}
/** Downloads a file through the authenticated client (keeps institute headers). */
async function downloadVia(url, fallbackName) {
  const res = await axios.get(url, { responseType: "blob" });
  const match = /filename="([^"]+)"/.exec(res.headers["content-disposition"] || "");
  const href = URL.createObjectURL(res.data);
  const a = Object.assign(document.createElement("a"), { href, download: match?.[1] || fallbackName });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 1000);
}
export const downloadEventCalendar = (eventId) => downloadVia(`${API_BASE_URl}/events/${eventId}/calendar.ics`, "event.ics");
export const exportEventAttendees = (eventId) => downloadVia(`${API_BASE_URl}/events/${eventId}/attendees/export`, "attendees.csv");

/* ------------------------------------------------------------------ */
/* Member settings: notifications, privacy, blocking, account           */
/* ------------------------------------------------------------------ */
export async function getMySettings() {
  return (await axios.get(`${API_BASE_URl}/me/settings`)).data.data;
}
/** partial: { notifications?: {cat: {in_app, email}}, privacy?: {...}, directory_visible? } */
export async function updateMySettings(patch) {
  return (await axios.put(`${API_BASE_URl}/me/settings`, patch)).data.data;
}
export async function getBlockedUsers() {
  return (await axios.get(`${API_BASE_URl}/me/blocks`)).data.data;
}
export async function blockUser(userId) {
  return (await axios.post(`${API_BASE_URl}/me/blocks`, { user_id: userId })).data.data;
}
export async function unblockUser(userId) {
  return (await axios.delete(`${API_BASE_URl}/me/blocks/${userId}`)).data.data;
}
export async function getMySessions() {
  return (await axios.get(`${API_BASE_URl}/me/sessions`)).data.data;
}
export async function revokeOtherSessions() {
  return (await axios.post(`${API_BASE_URl}/me/sessions/revoke-all`)).data;
}
export async function changeMyPassword({ current_password, new_password }) {
  return (await axios.post(`${API_BASE_URl}/changePassword`, { current_password, new_password })).data;
}
export async function deactivateMyAccount(password) {
  return (await axios.post(`${API_BASE_URl}/me/deactivate`, { password })).data;
}

/* ------------------------------------------------------------------ */
/* Theming                                                              */
/* ------------------------------------------------------------------ */
/** { theme, vars, font_url } – the member's effective (published) theme */
export async function getTheme() {
  return (await axios.get(`${API_BASE_URl}/theme`)).data.data;
}
const themeScope = ({ scope = "institute", institute_id } = {}) => ({ scope, ...(institute_id && { institute_id }) });
export async function getThemeEditor(scope) {
  const q = new URLSearchParams(themeScope(scope));
  return (await axios.get(`${API_BASE_URl}/admin/theme?${q}`)).data.data;
}
export async function saveThemeDraft(scope, draft) {
  return (await axios.put(`${API_BASE_URl}/admin/theme`, { ...themeScope(scope), draft })).data.data;
}
export async function publishTheme(scope) {
  return (await axios.post(`${API_BASE_URl}/admin/theme/publish`, themeScope(scope))).data.data;
}
export async function discardThemeDraft(scope) {
  return (await axios.post(`${API_BASE_URl}/admin/theme/discard`, themeScope(scope))).data.data;
}
export async function restoreTheme(scope, index) {
  return (await axios.post(`${API_BASE_URl}/admin/theme/restore`, { ...themeScope(scope), index })).data.data;
}
export async function setThemeLocks(locks) {
  return (await axios.put(`${API_BASE_URl}/admin/theme/locks`, { locks })).data.data;
}
export async function uploadThemeLogo(file) {
  const form = new FormData();
  form.append("image", file);
  return (await axios.post(`${API_BASE_URl}/admin/theme/logo`, form, { headers: { "Content-Type": "multipart/form-data" } })).data.data;
}

/* ------------------------------------------------------------------ */
/* Career history                                                       */
/* ------------------------------------------------------------------ */
const qs = (o) => new URLSearchParams(Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== "")).toString();
export async function getMyCareer() {
  return (await axios.get(`${API_BASE_URl}/me/career`)).data.data;
}
export async function getUserCareer(userId) {
  return (await axios.get(`${API_BASE_URl}/users/${userId}/career`)).data.data;
}
export async function savePosition(position) {
  const { id, ...body } = position;
  return id
    ? (await axios.put(`${API_BASE_URl}/me/career/${id}`, body)).data.data
    : (await axios.post(`${API_BASE_URl}/me/career`, body)).data.data;
}
export async function deletePosition(id) {
  return (await axios.delete(`${API_BASE_URl}/me/career/${id}`)).data.data;
}

/* ------------------------------------------------------------------ */
/* Jobs: saved + applications                                           */
/* ------------------------------------------------------------------ */
export async function getMemberJobs({ tab = "all", search = "", type = "", pageNumber = 1, pageSize = 20 } = {}) {
  return (await axios.get(`${API_BASE_URl}/me/jobs?${qs({ tab, search, type, pageNumber, pageSize })}`)).data.data;
}
export async function getMemberJob(id) {
  return (await axios.get(`${API_BASE_URl}/jobs/${id}`)).data.data;
}
/** status: saved | applied | interviewing | offer | closed, or null to remove */
export async function trackJob({ id, status, note }) {
  if (!status) return (await axios.delete(`${API_BASE_URl}/jobs/${id}/track`)).data.data;
  return (await axios.put(`${API_BASE_URl}/jobs/${id}/track`, { status, ...(note !== undefined && { note }) })).data.data;
}
export async function getJobAlumni(id) {
  return (await axios.get(`${API_BASE_URl}/jobs/${id}/alumni`)).data.data;
}

/* ------------------------------------------------------------------ */
/* News engagement                                                      */
/* ------------------------------------------------------------------ */
export async function getMemberNews({ category = "", search = "", saved = false, pageNumber = 1, pageSize = 12 } = {}) {
  return (await axios.get(`${API_BASE_URl}/me/news?${qs({ category, search, saved: saved || undefined, pageNumber, pageSize })}`)).data.data;
}
export async function getNewsDetail(id) {
  return (await axios.get(`${API_BASE_URl}/news/${id}/detail`)).data.data;
}
export async function setNewsSaved({ id, saved }) {
  return (await axios[saved ? "put" : "delete"](`${API_BASE_URl}/news/${id}/save`)).data.data;
}
export async function reactToNews({ id, reaction }) {
  return (await axios.put(`${API_BASE_URl}/news/${id}/reaction`, { reaction })).data.data;
}

/* ------------------------------------------------------------------ */
/* Mentorship                                                           */
/* ------------------------------------------------------------------ */
export async function getMyMentorProfile() {
  return (await axios.get(`${API_BASE_URl}/me/mentor-profile`)).data.data;
}
export async function saveMyMentorProfile(profile) {
  return (await axios.put(`${API_BASE_URl}/me/mentor-profile`, profile)).data.data;
}
export async function findMentors({ topic = "", search = "" } = {}) {
  return (await axios.get(`${API_BASE_URl}/mentors?${qs({ topic, search })}`)).data.data;
}
export async function getMyMentorships() {
  return (await axios.get(`${API_BASE_URl}/me/mentorships`)).data.data;
}
export async function requestMentor(body) {
  return (await axios.post(`${API_BASE_URl}/mentorships`, body)).data.data;
}
/** action: accept | decline | cancel | complete */
export async function respondMentorship({ id, action, response }) {
  return (await axios.patch(`${API_BASE_URl}/mentorships/${id}`, { action, ...(response !== undefined && { response }) })).data.data;
}

/* ------------------------------------------------------------------ */
/* Groups                                                               */
/* ------------------------------------------------------------------ */
export async function getGroups({ tab = "mine", search = "", kind = "" } = {}) {
  return (await axios.get(`${API_BASE_URl}/groups?${qs({ tab, search, kind })}`)).data.data;
}
export async function createGroup(body) {
  return (await axios.post(`${API_BASE_URl}/groups`, body)).data.data;
}
export async function getGroup(id) {
  return (await axios.get(`${API_BASE_URl}/groups/${id}`)).data.data;
}
export async function setGroupMembership({ id, join }) {
  return (await axios[join ? "post" : "delete"](`${API_BASE_URl}/groups/${id}/join`)).data.data;
}
export async function respondGroupRequest({ id, userId, approve }) {
  return (await axios.patch(`${API_BASE_URl}/groups/${id}/requests/${userId}`, { approve })).data.data;
}
export async function getGroupMembers({ id, status = "active", search = "" }) {
  return (await axios.get(`${API_BASE_URl}/groups/${id}/members?${qs({ status, search })}`)).data.data;
}
export async function getGroupPosts({ id, pageNumber = 1 }) {
  return (await axios.get(`${API_BASE_URl}/groups/${id}/posts?pageNumber=${pageNumber}`)).data.data;
}
export async function createGroupPost({ id, body }) {
  return (await axios.post(`${API_BASE_URl}/groups/${id}/posts`, { body })).data.data;
}
export async function deleteGroupPost({ id, postId }) {
  return (await axios.delete(`${API_BASE_URl}/groups/${id}/posts/${postId}`)).data.data;
}
export async function pinGroupPost({ id, postId, pinned }) {
  return (await axios.patch(`${API_BASE_URl}/groups/${id}/posts/${postId}`, { pinned })).data.data;
}

/* ------------------------------------------------------------------ */
/* Notifications: unread / delete                                       */
/* ------------------------------------------------------------------ */
export async function markNotificationsUnread(ids) {
  return (await axios.post(`${API_BASE_URl}/notifications/unread`, { ids })).data.data;
}
export async function deleteNotification(id) {
  return (await axios.delete(`${API_BASE_URl}/notifications/${id}`)).data.data;
}

/* ------------------------------------------------------------------ */
/* Member documents                                                     */
/* ------------------------------------------------------------------ */
export async function getMyDocuments() {
  return (await axios.get(`${API_BASE_URl}/me/documents`)).data.data;
}
export async function requestDocument(body) {
  return (await axios.post(`${API_BASE_URl}/me/documents`, body)).data.data;
}
export async function replyToDocument({ id, message }) {
  return (await axios.post(`${API_BASE_URl}/me/documents/${id}/reply`, { message })).data.data;
}
export async function withdrawDocument(id) {
  return (await axios.delete(`${API_BASE_URl}/me/documents/${id}`)).data.data;
}

/* ------------------------------------------------------------ profile + onboarding */
export async function getMyProfile() {
  return (await axios.get(`${API_BASE_URl}/me/profile`)).data.data;
}
export async function saveMyProfile(body) {
  return (await axios.put(`${API_BASE_URl}/me/profile`, body)).data.data;
}
export async function uploadProfilePhoto(file) {
  const fd = new FormData();
  fd.append("image", file);
  return (await axios.put(`${API_BASE_URl}/me/profile/photo`, fd)).data.data;
}
export async function finishOnboarding() {
  return (await axios.post(`${API_BASE_URl}/me/onboarding/done`)).data.data;
}
export async function getUserProfile(userId) {
  return (await axios.get(`${API_BASE_URl}/users/${userId}/profile`)).data.data;
}

/* ------------------------------------------------------------ chat extras */
export async function respondChatRequest({ peerId, action }) {
  return (await axios.post(`${API_BASE_URl}/chat/requests/${peerId}`, { action })).data.data;
}
export async function updateConversation({ peerId, ...body }) {
  return (await axios.patch(`${API_BASE_URl}/chat/conversations/${peerId}`, body)).data.data;
}
export async function reactToMessage({ id, emoji }) {
  return (await axios.post(`${API_BASE_URl}/chat/messages/${id}/reactions`, { emoji })).data.data;
}
export async function reportMessage({ id, reason, details, block }) {
  return (await axios.post(`${API_BASE_URl}/chat/messages/${id}/report`, { reason, details, block })).data.data;
}

/* ------------------------------------------------------------ admin queues */
export async function getAdminDocuments({ status = "open", search = "", page = 1 } = {}) {
  const params = new URLSearchParams({ status, search, page });
  return (await axios.get(`${API_BASE_URl}/admin/documents?${params}`)).data;
}
export async function updateDocumentStatus({ id, status, comment }) {
  return (await axios.put(`${API_BASE_URl}/updateVerificationRequest`, { id, status, comment })).data;
}
export async function getMessageReports({ status = "open", page = 1 } = {}) {
  return (await axios.get(`${API_BASE_URl}/admin/message-reports?status=${status}&page=${page}`)).data.data;
}
export async function resolveMessageReport({ id, status, note }) {
  return (await axios.patch(`${API_BASE_URl}/admin/message-reports/${id}`, { status, note })).data.data;
}

/** public landing page: numbers, next events, latest stories for this institute */
export async function getPublicHome() {
  return (await axios.get(`${API_BASE_URl}/public/home`)).data.data;
}
