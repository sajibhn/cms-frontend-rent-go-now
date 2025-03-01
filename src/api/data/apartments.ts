import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS } from './client/api-endpoints';
import { toast } from 'react-toastify';
import { Apartments } from '@/types';
import { apartmentsClient } from './client/apartments';

export const useApartmentsQuery = (params: any = {}, options?: any) => {
	const { data, error, isPending, refetch, isError, isLoading } = useQuery<
		Apartments[],
		Error
	>({
		queryKey: [API_ENDPOINTS.APARTMENTS, params],
		queryFn: ({ queryKey, pageParam }) =>
			apartmentsClient.all(Object.assign({}, queryKey[1], pageParam)),
		staleTime: 5000,
		...options,
	});

	return {
		data: data ?? [],
		error,
		initialLoading: isPending,
		refetch,
		isError,
		loading: isLoading,
	};
};

export const useApartmentQuery = ({ id, options }: any) => {
	const { data, error, isPending, refetch, isError, isLoading } = useQuery<
		Apartments,
		Error
	>({
		queryKey: [API_ENDPOINTS.APARTMENTS, { id }],
		queryFn: () => apartmentsClient.get({ id }),
		staleTime: 5000,
		...options,
	});

	return {
		data: data ?? {},
		error,
		initialLoading: isPending,
		refetch,
		isError,
		loading: isLoading,
	};
};

export function useApartmentMutation() {
	return useMutation({
		mutationFn: apartmentsClient.create,
		onSuccess: () => {
			toast.success('Apartment is created');
		},
		onError: async (error: any) => {
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
	});
}

export function useUpdateApartmentsMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: apartmentsClient.update,
		onSuccess: (_data, variables) => {
			const { id } = variables;
			toast.success('Apartments is updated');
			queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.APARTMENTS, { id }] });
		},
		onError: async (error: any) => {
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
	});
}
