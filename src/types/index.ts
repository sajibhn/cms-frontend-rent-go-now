export interface Sessions {
 id: string;
 createdAt: Date;
 createdBy: null;
 updatedAt: Date;
 updatedBy: null;
 deletedAt: null;
 token: string;
 lastActivity: Date;
 user: Users;
}

export interface Users {
 first_name: string;
 last_name: string;
 email: string;
 isUsResident: boolean;
 userRole: Roles[];
 createdBy: string | null;
 updatedBy: string | null;
 deletedAt: string | null;
 id: string;
 role: string;
 createdAt: string;
 updatedAt: string;
 message: string;
}

export interface Roles {
 name: string;
 description: string;
 createdBy: string | null;
 updatedBy: string | null;
 deletedAt: string | null;
 id: string;
 createdAt: string;
 updatedAt: string;
}

export interface AuthResponse {
 id: string;
 firstName: string;
 lastName: string;
 email: string;
 roles: string[];
 token: string;
 session: Sessions;
}

export interface OtpInput {
 email: string;
}

export interface LoginInput {
 email: string;
 otp: number;
}

export interface GetParams {
 id: string;
}

export interface PaginatorInfo<T> {
 current_page: number;
 data: T[];
 first_page_url: string;
 from: number;
 last_page: number;
 last_page_url: string;
 links: any[];
 next_page_url: string | null;
 path: string;
 per_page: number;
 prev_page_url: string | null;
 to: number;
 total: number;
}

export enum SortOrder {
 Asc = 'asc',
 Desc = 'desc',
}

export interface QueryOptions {
 language?: string;
 limit?: number;
 page?: number;
 orderBy?: string;
 sortedBy?: SortOrder;
}
export interface State {
 id: string;
 name: string;
 location: {
  coordinates: number[];
 };
 description: string;
 createdAt: string;
 updatedAt: string;
 url: string;
 media: string[];
}

export interface CreateStateInput {
 id?: string;
 name: string;
 description: string;
 location: {
  type: string;
  coordinates: number[];
 };
 url: string;
}

export interface City {
 id: string;
 name: string;
 location: {
  coordinates: number[];
 };
 description: string;
 createdAt: string;
 updatedAt: string;
 url: string;
 state: State;
}

export interface CreateCityInput {
 id?: string;
 name: string;
 description: string;
 location: {
  type: string;
  coordinates: number[];
 };
 url: string;
 stateId: string;
}

export interface Neighborhood {
 id: string;
 name: string;
 location: {
  coordinates: number[];
 };
 description: string;
 createdAt: string;
 updatedAt: string;
 url: string;
 city: State;
}

export interface CreateNeighborhoodInput {
 id?: string;
 name: string;
 description: string;
 location: {
  type: string;
  coordinates: number[];
 };
 url: string;
 cityId: string;
}

export interface Apartments {
 id: string;
 name: string;
 address: string,
 location: {
  coordinates: number[];
 };
 description: string;
 createdAt: string;
 updatedAt: string;
 url: string;
 neighborhood: Neighborhood;
}

export interface CreateApartmentsInput {
 id?: string;
 name: string;
 address: string,
 description: string;
 location: {
  type: string;
  coordinates: number[];
 };
 url: string;
 neighborhoodId: string;
}

export interface CreateUnitInput {
 id?: string;
 name: string;
 bedrooms: number;
 bathrooms: number;
 floorArea: number;
 price: number;
 minLeaseMonths: number;
 minRentPeriod: number;
 contact: string;
 amenities: string;
 facilities: string;
 isFullyFurnished: boolean;
 description?: string;
 apartmentId: string;
};

export type Unit = {
 id: string;
 name: string;
 bedrooms: number;
 bathrooms: number;
 floorArea: number;
 price: number;
 minLeaseMonths: number;
 minRentPeriod: number;
 contact: string;
 amenities: string;
 facilities: string;
 isFullyFurnished: boolean;
 description?: string;
 createdAt: string;
 updatedAt: string;
 apartment: Apartments;
};