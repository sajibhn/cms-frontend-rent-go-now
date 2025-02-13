import { State, CreateStateInput, QueryOptions } from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';

export const stateClient = {
 ...crudFactory<State, QueryOptions, CreateStateInput>(API_ENDPOINTS.STATE),
};
