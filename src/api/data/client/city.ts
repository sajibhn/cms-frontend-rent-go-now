import { City, CreateCityInput, QueryOptions } from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';

export const cityClient = {
 ...crudFactory<City, QueryOptions, CreateCityInput>(API_ENDPOINTS.CITY),
};
