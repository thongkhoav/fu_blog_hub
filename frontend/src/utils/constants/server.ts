import axios from "axios";

const getBaseUrl = () => {
  let url;
  switch (process.env.NODE_ENV) {
    case "production":
      url = "https://stackoverflow.com";
      break;
    case "development":
    default:
      url = "https://google.com";
  }

  return url;
};

export default axios.create({
  baseURL: getBaseUrl()
});
export const HOST = process.env.REACT_APP_API_URL || "http://localhost:4000";
