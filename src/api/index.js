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
  return await axios.get(`${API_BASE_URl}/getDepartments?pageNumber=${pageNumber}&pageSize=${pageSize}`);
}

export async function getRoles({ pageNumber, pageSize }) {
  const paging = { pageNumber, pageSize };
  return await axios.get(`${API_BASE_URl}/getAllRole`, paging);
}

export async function createNewRole({ role_name }) {
  const data = { role_name }
  console.log(data);
  return await axios.post(`${API_BASE_URl}/createRole`, data);
}

export async function deleteRole(role) {
  console.log(role)
  console.log(role.id)
  return await axios.get(`${API_BASE_URl}/deleteRole?id=${role.id}`);
}

export async function createDepartment(department) {
  console.log(department);
  return await axios.post(`${API_BASE_URl}/createDepartment`, department);
}

export async function editDepartent(department) {
  console.log(department)
  return await axios.put(`${API_BASE_URl}/updateDepartment`, department);
}

export async function deleteDepartment(department) {
  return await axios.get(`${API_BASE_URl}/deleteDepartment?id=${department.id}`);
}

export async function createInstitute(instituteData) {

  console.log(instituteData)

  return await axios.post(`${API_BASE_URl}/createInstitute`, instituteData);
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

export async function createAddress({ country, region, city, houseNumber }) {
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


export async function getAllinstituteAdmins({ pageNumber, pageSize, value }) {
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

export async function getRoleByName({ name }) {
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


export async function updateAddress(addressData) {
  console.log(addressData)
  return await axios.put(`${API_BASE_URl}/updateAddress`, addressData);
}

export async function updateInstitute(instituteData) {
  console.log(instituteData)
  return await axios.put(`${API_BASE_URl}/updateInstitute`, instituteData);
}

export async function deleteInstitute(instituteData) {
  console.log(instituteData)
  const response = await axios({
    method: 'GET',
    url: `${API_BASE_URl}/deleteAddress?id=${instituteData.address_id}`,
    headers: {
      'Content-Type': 'application/json'
    }
  });
  console.log(response)

  return await axios.get(`${API_BASE_URl}/deleteInstitute?id=${instituteData.institute_id}`);
}

export async function updateAdmin(adminData) {
  console.log(adminData)
  return await axios.put(`${API_BASE_URl}/profileUpdate`, adminData);
}

export async function deleteAdmin(adminData) {
  const addressDelete = await axios.get(`${API_BASE_URl}/deleteAddress?id=${adminData.address_id}`);
  const birthPlaceDelete = await axios.get(`${API_BASE_URl}/deleteAddress?id=${adminData.birth_place_id}`);
  return await axios.get(`${API_BASE_URl}/deleteUser?id=${adminData.id}`);

}

export async function getAllEvents({ pageNumber, pageSize }) {
  try {
    return await axios.get(`${API_BASE_URl}/getAllEvents?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}

export async function getInstituteEvents({ institute_id, max_count }) {
  try {
    return await axios.get(`${API_BASE_URl}/getInstituteEvents?max_count=${max_count}&institute_id=${institute_id}`);
  } catch (error) {
    console.log("Error fetching institute events ", error)
    throw error;
  }
}

export async function getEventById(event_id) {
  return await axios.get(`${API_BASE_URl}/getEventById?id=${event_id}`);
}

export async function createEvents(eventData) {
  console.log(eventData)

  const response = await axios.post(`${API_BASE_URl}/createEvent`, eventData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response;
}

export async function updateEvent(eventData) {
  console.log(eventData)
  const response = await axios.put(`${API_BASE_URl}/updateEvent`, eventData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response;
}

export async function deleteEvent(event_id) {
  console.log(event_id)
  return await axios.get(`${API_BASE_URl}/deleteEvents?id=${event_id}`);
}

export async function filterEvents() {

}

export async function getEventsStatByDate(institute_id, max_count) {
  return await axios.get(`${API_BASE_URl}/getEventsStatByDate?institute_id=${institute_id}&max_count=${max_count}`);
}

export async function getAllNews({ pageNumber, pageSize }) {
  try {
    return await axios.get(`${API_BASE_URl}/getAllNews?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
}

export async function createNews(newsData) {
  console.log(newsData)
  const response = await axios.post(`${API_BASE_URl}/createNews`, newsData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response;
}


export async function updateNews(newsData) {
  console.log(newsData)
  const response = await axios.put(`${API_BASE_URl}/updateNews`, newsData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response;

}

export async function deletedNews(news_id) {
  console.log(news_id)
  return await axios.get(`${API_BASE_URl}/deleteNews?id=${news_id}`);
}

//permission

export async function getAllPremissions({pageNumber, pageSize}) {
  console.log(pageNumber, pageSize)
  const result = await axios.get(`${API_BASE_URl}/getAllPermission?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  return result;
}

export async function getPermissionById(permission_id) {
  const result = await axios.get(`${API_BASE_URl}/getPermissionById?id=${permission_id}`);
  return result;
}

export async function createPermission(permissionData) {
  console.log(permissionData)
  const result = axios.post(`${API_BASE_URl}/createPermission`, permissionData);
  console.log(result)
  return result;
}

export async function deletePermission(permissionData) {
  console.log(permissionData)
  // const result = await axios.get(`${API_BASE_URl}/deletePermission?id=${permission_id}`);
  // console.log(result)
  // return result;
  return await axios.get(`${API_BASE_URl}/deletePermission?id=${permissionData.id}`);
}

export async function updatePermission(permissionData) {
  console.log(permissionData);
  const result = await axios.put(`${API_BASE_URl}/updatePermission`, permissionData);
  return result;
}

// jobs 

export async function getAllJobs({ pageNumber, pageSize}) {
  const result = await axios.get(`${API_BASE_URl}/getAllJobs?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  return result;
}

export async function createJob(jobData) {
  console.log(jobData)
  const response = await axios.post(`${API_BASE_URl}/createJob`, jobData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response;
}

export async function updateJob(jobData) {
  console.log(jobData)
  const response = await axios.put(`${API_BASE_URl}/updateJob`, jobData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response;

}

export async function deleteJob(jobs_id) {
  console.log(jobs_id)
  return await axios.get(`${API_BASE_URl}/deleteJob?id=${jobs_id}`);
}