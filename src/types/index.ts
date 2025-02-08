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
