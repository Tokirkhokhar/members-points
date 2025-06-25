import axios, { AxiosRequestConfig } from "axios";
import { appConfig } from "./app.config";
import { removeCookie } from "@/lib/utils";

export const axiosInstance = axios.create({
  baseURL: appConfig.apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getReq = async (url: string, config?: AxiosRequestConfig<any>) => {
  const options = config || {};
  try {
    const response = await axiosInstance.get(url, options);
    return response.data;
  } catch (err: any) {
    if (err.response.status === 401) {
      // window.location.href = "/";
    }
    throw err;
  }
};
export const postReq = async <K>(
  url: string,
  data: K,
  config?: AxiosRequestConfig<any>
) => {
  const options = config || {};
  try {
    const response = await axiosInstance.post(url, data, options);
    return response.data;
  } catch (err: any) {
    if (url.includes("members/generate-token")) {
      removeCookie("actk");
    }
    if (err.response.status === 401) {
      window.location.href = "/";
    }
    throw err;
  }
};

export const patchReq = async <K>(
  url: string,
  data: K,
  config?: AxiosRequestConfig<any>
) => {
  const options = config || {};
  try {
    const response = await axiosInstance.patch(url, data, options);
    return response.data;
  } catch (err: any) {
    if (err.response.status === 401) {
      window.location.href = "/";
    }
    throw err;
  }
};
