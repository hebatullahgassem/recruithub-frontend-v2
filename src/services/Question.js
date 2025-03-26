import { AxiosApi } from "./Api";

export const createQuestion = async (question) => {
  const response = await AxiosApi.post("question", question);
  return response.data;
};

export const getQuestions = async () => {
  const response = await AxiosApi.get("question");
  return response.data;
};

export const getQuestion = async (id) => {
  const response = await AxiosApi.get(`question/${id}`);
  return response.data;
};

export const updateQuestion = async (id, question) => {
  const response = await AxiosApi.put(`question/${id}`, question);
  return response.data;
};

export const deleteQuestion = async (id) => {
  const response = await AxiosApi.delete(`question/${id}`);
  return response.data;
};
