import axios from "axios";
import { getBaseUrl } from "~/utils/constants";
const BASE_URL = getBaseUrl();

export default axios.create({
  baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});
