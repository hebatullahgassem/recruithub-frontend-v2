import { AxiosApi } from "./Api";

// Create Application
export const createApplication = async (applicationData) => {
  const response = await AxiosApi.post("applications/", applicationData);
  return response.data;
};

// Get All Applications
export const getAllApplications = async () => {
  const response = await AxiosApi.get("applications/");
  return response.data;
};

// Get Applications by User ID
export const getApplicationsByUserId = async (userId) => {
  const response = await AxiosApi.get(`applications/?user_id=${userId}`);
  return response.data;
};

// Get Application by ID
export const getApplicationById = async (id) => {
  const response = await AxiosApi.get(`applications/${id}/`);
  return response.data;
};

// Update Application by ID
export const updateApplication = async (id, updatedData) => {
  const response = await AxiosApi.put(`applications/${id}/`, updatedData);
  return response.data;
};

// Delete Application by ID
export const deleteApplication = async (id) => {
  await AxiosApi.delete(`/applications/${id}/`);
};
