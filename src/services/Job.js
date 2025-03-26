import { AxiosApi } from "./Api";

// Create Job
export const createJob = async (jobData) => {
  const response = await AxiosApi.post("jobs/", jobData);
  return response.data;
};

// Get All Jobs
export const getAllJobs = async () => {
  const response = await AxiosApi.get("jobs/");
  return response.data;
};

// Get Job by ID
export const getJobById = async (id) => {
  const response = await AxiosApi.get(`jobs/${id}/`);
  return response.data;
};

// Update Job by ID
export const updateJob = async (id, updatedData) => {
  const response = await AxiosApi.put(`jobs/${id}/`, updatedData);
  return response.data;
};

// Delete Job by ID
export const deleteJob = async (id) => {
  await AxiosApi.delete(`jobs/${id}/`);
};

