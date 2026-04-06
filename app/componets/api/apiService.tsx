"use client";

import axios from "axios";

// axios instance - using Next.js rewrites
const apiClient = axios.create({
  baseURL: '/api', // This will be rewritten to your backend
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Add interceptors for logging (same as above)
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout:', error);
    } else if (error.response) {
      console.error('Response error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const useApi = () => {
  const get = async <T,>(url: string, params?: any): Promise<T> => {
    try {
      const res = await apiClient.get(url, { params });
      return res.data;
    } catch (error) {
      console.error(`GET request failed for ${url}:`, error);
      throw error;
    }
  };

  const post = async <T,>(url: string, data?: any): Promise<T> => {
    try {
      const res = await apiClient.post(url, data);
      return res.data;
    } catch (error) {
      console.error(`POST request failed for ${url}:`, error);
      throw error;
    }
  };

  const put = async <T,>(url: string, data?: any): Promise<T> => {
    try {
      const res = await apiClient.put(url, data);
      return res.data;
    } catch (error) {
      console.error(`PUT request failed for ${url}:`, error);
      throw error;
    }
  };

  const del = async <T,>(url: string): Promise<T> => {
    try {
      const res = await apiClient.delete(url);
      return res.data;
    } catch (error) {
      console.error(`DELETE request failed for ${url}:`, error);
      throw error;
    }
  };

  return { get, post, put, del };
};