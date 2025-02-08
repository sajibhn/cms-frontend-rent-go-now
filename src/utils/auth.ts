import { Sessions } from '@/types';
import { parse } from 'cookie';
import Cookie from 'js-cookie';
import { AUTH_CRED, PERMISSIONS, SUPERADMIN, TOKEN } from './constant';

export const allowedRoles = [SUPERADMIN];

export async function setAuthCredentials(
 id: string,
 firstName: string,
 lastName: string,
 email: string,
 permissions: string[],
 token: string,
 session: Sessions
) {
 Cookie.set(
  AUTH_CRED,
  JSON.stringify({
   id,
   firstName,
   lastName,
   email,
   permissions,
   token,
   session,
  })
 );
}

export function getAuthCredentials(context?: any): {
 id: string | null;
 firstName: string | null;
 lastName: string | null;
 email: string | null;
 permissions: string[] | null;
 token: string | null;
 session: Sessions | null;
} {
 let authCred;
 if (context) {
  authCred = parseSSRCookie(context)[AUTH_CRED];
 } else {
  authCred = Cookie.get(AUTH_CRED);
 }
 if (authCred) {
  return JSON.parse(authCred);
 }

 return {
  id: null,
  firstName: null,
  lastName: null,
  email: null,
  permissions: null,
  token: null,
  session: null,
 };
}

export function parseSSRCookie(context: any) {
 return parse(context?.req?.headers?.cookie ?? '');
}

export function isAuthenticated(_cookies: any) {
 return (
  !!_cookies[TOKEN] &&
  Array.isArray(_cookies[PERMISSIONS]) &&
  !!_cookies[PERMISSIONS].length
 );
}

export function hasAccess(
 _allowedRoles: string[],
 _userPermissions: string[] | undefined | null
) {
 if (_userPermissions) {
  return Boolean(
   _allowedRoles?.find((aRole) => _userPermissions.includes(aRole))
  );
 }
 return false;
}
