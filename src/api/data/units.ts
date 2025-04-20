import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS } from './client/api-endpoints';
import { toast } from 'react-toastify';
import { Unit } from '@/types';
import { unitsClient } from './client/units';

export const useUnitsQuery = (params: any = {}, options?: any) => {
	const { data, error, isPending, refetch, isError, isLoading } = useQuery<
		Unit[],
		Error
	>({
		queryKey: [API_ENDPOINTS.UNITS, params],
		queryFn: ({ queryKey, pageParam }) =>
			unitsClient.all(Object.assign({}, queryKey[1], pageParam)),
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

export const useUnitQuery = ({ id, options }: any) => {
	const { data, error, isPending, refetch, isError, isLoading } = useQuery<
		Unit,
		Error
	>({
		queryKey: [API_ENDPOINTS.UNITS, { id }],
		queryFn: () => unitsClient.get({ id }),
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

export function useUnitMutation() {
	return useMutation({
		mutationFn: unitsClient.create,
		onSuccess: () => {
			toast.success('Unit is created');
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

export function useUpdateUnitMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: unitsClient.update,
		onSuccess: (_data, variables) => {
			const { id } = variables;
			toast.success('Unit is updated');
			queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.UNITS, { id }] });
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
