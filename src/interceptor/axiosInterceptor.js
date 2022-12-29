import axios from "axios";

const getLocalAccessToken = () => {
  const accessToken = localStorage.getItem("accessToken");
  return accessToken;
};

const fetch = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

fetch.interceptors.request.use(
  (config) => {
    const token = getLocalAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token.slice(1, -1)}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default fetch;
