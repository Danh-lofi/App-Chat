import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import queryString from "query-string";

const URL = "http://192.168.1.14:3001";

const ApiManager = axios.create({
  //baseURL: "http://localhost:3001", ///api/users
  baseURL: URL,
  responseType: "json",
  withCredentials: true,
});

export const apiGet = axios.create({
  // baseURL: "http://localhost:3001",
  baseURL: URL,
  headers: {
    "content-type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

apiGet.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log("config: " + config);
  return config;
});

export default ApiManager;
