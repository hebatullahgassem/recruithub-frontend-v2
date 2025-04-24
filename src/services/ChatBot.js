import { AxiosApi } from "./Api";

export const askChatBot = async (question) => {
  if (!question) {
    console.error("No question provided.");
    throw new Error("No question provided.");
  }
  try {
    const response = await AxiosApi.post(
      "user/chatbot/ask_chatbot/",
      { question },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("ChatBot Error:", error);
    throw error;
  }
};

export const createRag = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await AxiosApi.post("user/chatbot/post_rag/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};
export const getRag = async (page = 1, pageSize = 10) => {
  try {
    const response = await AxiosApi.get("user/chatbot/get_rag/", {
      params: {
        page: page,
        page_size: pageSize,
      },
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("ChatBot Error:", error);
    throw error;
  }
};

export const deleteRag = async (id) => {
  try {
    const response = await AxiosApi.delete(`user/chatbot/delete_rag/?id=${id}`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });
    if (response.status !== 200) {
      throw new Error(response.data);
    }
    return response.data;
  } catch (error) {
    console.error("ChatBot Error:", error);
    throw error;
  }
};

export const getQuota = async () => {
  try {
    const response = await AxiosApi.get("user/chatbot/get_quota/", {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("ChatBot Error:", error);
    throw error;
  }
};