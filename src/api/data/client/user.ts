import {
	AuthResponse,
	LoginInput,
	OtpInput,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from '../http-client';

export const userClient = {
	login: (variables: LoginInput) => {
		return HttpClient.post<AuthResponse>(API_ENDPOINTS.LOGIN, variables);
	},
	otp: (variables: OtpInput) => {
		return HttpClient.post<AuthResponse>(API_ENDPOINTS.OTP, variables);
	},
	logout: () => {
		return HttpClient.post<any>(API_ENDPOINTS.LOGOUT, {});
	},
};
