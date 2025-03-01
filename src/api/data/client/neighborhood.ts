import { Neighborhood, CreateNeighborhoodInput, QueryOptions } from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';

export const neighborhoodClient = {
	...crudFactory<Neighborhood, QueryOptions, CreateNeighborhoodInput>(API_ENDPOINTS.NEIGHBORHOOD),
};
