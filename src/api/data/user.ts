import { useMutation } from "@tanstack/react-query";
import { userClient } from "./client/user";
import Cookies from 'js-cookie';
import { useRouter } from "next/router";
import { AUTH_CRED } from "@/utils/constant";
import { Routes } from "@/utils/routes";
import { toast } from 'react-toastify';

export function useLoginMutation() {
	return useMutation({
		mutationFn: userClient.login,
		onSuccess: () => {
			toast.success('Sent logged in succesfully!');
		},
		onError: async (error: any, query) => {
			const response = JSON.stringify(error);
			const response2 = JSON.parse(response);
			if (response2.status === 500) {
				return toast.error('There was an error while login');
			} else if (
				error.response &&
				error.response.data &&
				error.response.data.message
			) {
				return toast.error(error.response.data.message);
			}

			toast.error('Unable to login');
		},
	})
}


export function useOtpMutation() {
	return useMutation({

		mutationFn: userClient.otp,

		onError: async (error: any, query) => {
			const response = JSON.stringify(error);
			const response2 = JSON.parse(response);
			if (response2.status === 500) {
				return toast.error('There was an error Sending an OTP');
			} else if (
				error.response &&
				error.response.data &&
				error.response.data.message
			) {
				return toast.error(error.response.data.message);
			}

			toast.error('Unable to Send OTP');
		},
		onSuccess: async () => {
			toast.success('Sent OTP succesfully!');
		},
	});
}

export const useLogoutMutation = () => {
	const router = useRouter();

	return useMutation({
		mutationFn: userClient.logout,

		onSuccess: () => {
			Cookies.remove(AUTH_CRED);
			router.replace(Routes.login);
			toast.success('Successfully Logged out');
		},
	});
};

