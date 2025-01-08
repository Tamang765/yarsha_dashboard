import axios from "axios";

interface Session {
  accessToken: string | null;
}

const axiosInstance = axios.create({
  baseURL: "http://localhost:4005/",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    )
);

export default axiosInstance;

export const setSession = (accessToken: string) => {
  if (accessToken) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  }
};
