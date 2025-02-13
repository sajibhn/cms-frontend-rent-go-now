import { useMutation, useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS } from './client/api-endpoints';
import { stateClient } from './client/state';
import { toast } from 'react-toastify';
import { State } from '@/types';

export const useStatesQuery = (params: any = {}, options?: any) => {
 const { data, error, isPending, refetch, isError } = useQuery<State[], Error>({
  queryKey: [API_ENDPOINTS.STATE, params],
  queryFn: ({ queryKey, pageParam }) =>
   stateClient.all(Object.assign({}, queryKey[1], pageParam)),
  staleTime: 5000,
  ...options,
 });

 return {
  data: data ?? [],
  error,
  loading: isPending,
  refetch,
  isError,
 };
};

export const useStateQuery = ({ id, options }: any) => {
 const { data, error, isPending, refetch, isError, fetchStatus, status } =
  useQuery<State, Error>({
   queryKey: [API_ENDPOINTS.STATE, { id }],
   queryFn: () => stateClient.get({ id }),
   staleTime: 5000,
   ...options,
  });

 return {
  data: data ?? {},
  error,
  loading: isPending,
  refetch,
  isError,
  fetchStatus,
  status,
 };
};

export function useStateMutation() {
 return useMutation({
  mutationFn: stateClient.create,
  onSuccess: () => {
   toast.success('State is created');
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

export function useUpdateStateMutation() {
 return useMutation({
  mutationFn: stateClient.update,
  onSuccess: () => {
   toast.success('State is updated');
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
