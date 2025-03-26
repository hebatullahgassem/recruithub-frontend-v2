import axios from "axios";
import { useContext } from "react";
import { userContext } from "../context/UserContext";

const API_BASE_URL = "http://localhost:8000/";

// Setup Axios instance
const {token} = useContext(userContext);
export const AxiosApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Token ${token}`,
  },
});
