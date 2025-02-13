import { AUTH_CRED } from '@/utils/constant';
import assert from 'assert';
import Axios from 'axios';
import Cookies from 'js-cookie';
import Router from 'next/router';

assert(
 process.env.NEXT_PUBLIC_API_BASE_URL,
 'env variable not set: NEXT_PUBLIC_API_BASE_URL (did you forget to create a .env file from .env.template?)'
);

export const axios = Axios.create({
 baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
 timeout: 100000,
 headers: {
  'Content-Type': 'application/json',
 },
});

const AUTH_TOKEN_KEY = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY ?? AUTH_CRED;

axios.interceptors.request.use((config: any) => {
 const cookies = Cookies.get(AUTH_TOKEN_KEY);
 let token = '';
 if (cookies) {
  token = JSON.parse(cookies)['token'];
 }
 config.headers = {
  ...config.headers,
  Authorization: `Bearer ${token}`,
 };
 return config;
});

axios.interceptors.response.use(
 (response) => response,
 (error) => {
  if (
   (error.response && error.response.status === 401) ||
   (error.response && error.response.status === 403) ||
   (error.response && error.response.data.message === 'Not Authorized')
  ) {
   if (error.response && error.response.status === 401) {
    Cookies.remove(AUTH_TOKEN_KEY);
    Router.reload();
   }
  }
  return Promise.reject(error);
 }
);

export class HttpClient {
 static async get<T>(url: string, params?: unknown) {
  const response = await axios.get<T>(url, { params });
  return response.data;
 }

 static async post<T>(url: string, data: unknown, options?: any) {
  const response = await axios.post<T>(url, data, options);
  return response.data;
 }

 static async patch<T>(url: string, data: unknown) {
  const response = await axios.patch<T>(url, data);
  return response.data;
 }

 static async delete<T>(url: string) {
  const response = await axios.delete<T>(url);
  return response.data;
 }
}
