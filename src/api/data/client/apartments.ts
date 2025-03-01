import { Apartments, CreateApartmentsInput, QueryOptions } from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';

export const apartmentsClient = {
	...crudFactory<Apartments, QueryOptions, CreateApartmentsInput>(API_ENDPOINTS.APARTMENTS),
};
