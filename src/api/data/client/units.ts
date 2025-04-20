import { CreateUnitInput, QueryOptions, Unit } from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';

export const unitsClient = {
	...crudFactory<Unit, QueryOptions, CreateUnitInput>(API_ENDPOINTS.UNITS),
};
