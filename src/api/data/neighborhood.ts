import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS } from './client/api-endpoints';
import { toast } from 'react-toastify';
import { Neighborhood } from '@/types';
import { neighborhoodClient } from './client/neighborhood';

export const useNeighborhoodsQuery = (params: any = {}, options?: any) => {
	const { data, error, isPending, refetch, isError, isLoading } = useQuery<
		Neighborhood[],
		Error
	>({
		queryKey: [API_ENDPOINTS.NEIGHBORHOOD, params],
		queryFn: ({ queryKey, pageParam }) =>
			neighborhoodClient.all(Object.assign({}, queryKey[1], pageParam)),
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

export const useNeighborhoodQuery = ({ id, options }: any) => {
	const { data, error, isPending, refetch, isError, isLoading } = useQuery<
		Neighborhood,
		Error
	>({
		queryKey: [API_ENDPOINTS.NEIGHBORHOOD, { id }],
		queryFn: () => neighborhoodClient.get({ id }),
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

export function useNeighborhoodMutation() {
	return useMutation({
		mutationFn: neighborhoodClient.create,
		onSuccess: () => {
			toast.success('Neighborhood is created');
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

export function useUpdateNeighborhoodMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: neighborhoodClient.update,
		onSuccess: (_data, variables) => {
			const { id } = variables;
			toast.success('Neighborhood is updated');
			queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.NEIGHBORHOOD, { id }] });
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
