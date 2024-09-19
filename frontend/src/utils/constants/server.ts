import axios from "axios";

export const getBaseUrl = () => {
  let url;
  switch (process.env.NODE_ENV) {
    case "production":
      url = process.env.REACT_APP_API_URL;
      break;
    case "development":
      url = process.env.REACT_APP_API_URL;
      break;
    default:
      url = process.env.REACT_APP_API_URL || "http://localhost:4000";
  }

  return url;
};

export default axios.create({
  baseURL: getBaseUrl()
});
export const HOST = process.env.REACT_APP_API_URL || "http://localhost:4000";
