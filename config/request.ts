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
  const token = localStorage.getItem("auth_token");

  try {
    const response = await axiosInstance.get(url, {
      ...options,
      headers: token
        ? {
            ...options.headers,
            Authorization: `Bearer ${token}`,
          }
        : options.headers,
    });
    return response.data;
  } catch (err: any) {
    if (err.response.status === 401) {
      // window.location.href = "/";
    }
    throw err;
  }
};
export const postReq = async (
  url: string,
  data = {},
  config?: AxiosRequestConfig<any>
) => {
  const options = config || {};
  try {
    const token = localStorage.getItem("auth_token");

    const response = await axiosInstance.post(url, data, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
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
    const token = localStorage.getItem("auth_token");

    const response = await axiosInstance.patch(url, data, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err: any) {
    if (err.response.status === 401) {
      window.location.href = "/";
    }
    throw err;
  }
};
