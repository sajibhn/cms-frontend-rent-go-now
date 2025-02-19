import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS } from './client/api-endpoints';
import { toast } from 'react-toastify';
import { City } from '@/types';
import { cityClient } from './client/city';

export const useCitiesQuery = (params: any = {}, options?: any) => {
 const { data, error, isPending, refetch, isError, isLoading } = useQuery<
  City[],
  Error
 >({
  queryKey: [API_ENDPOINTS.CITY, params],
  queryFn: ({ queryKey, pageParam }) =>
   cityClient.all(Object.assign({}, queryKey[1], pageParam)),
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

export const useCityQuery = ({ id, options }: any) => {
 const { data, error, isPending, refetch, isError, isLoading } = useQuery<
  City,
  Error
 >({
  queryKey: [API_ENDPOINTS.CITY, { id }],
  queryFn: () => cityClient.get({ id }),
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

export function useCityMutation() {
 return useMutation({
  mutationFn: cityClient.create,
  onSuccess: () => {
   toast.success('City is created');
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

export function useUpdateCityMutation() {
 const queryClient = useQueryClient();

 return useMutation({
  mutationFn: cityClient.update,
  onSuccess: (_data, variables) => {
   const { id } = variables;
   toast.success('City is updated');
   queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.CITY, { id }] });
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
