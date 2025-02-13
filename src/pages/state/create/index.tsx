import { GetServerSideProps } from 'next';
import {
 allowedRoles,
 getAuthCredentials,
 hasAccess,
 isAuthenticated,
} from '@/utils/auth';
import { Routes } from '@/utils/routes';
import CreateOrUpdateForm from '@/components/state/create-or-update-state';
import { ContentLayout } from '@/components/ui/content-layout';

const StateCreate = () => {
 return (
  <ContentLayout title='Create State'>
   <CreateOrUpdateForm />
  </ContentLayout>
 );
};

export default StateCreate;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
 const { token, permissions } = getAuthCredentials(ctx);
 if (
  !isAuthenticated({ token, permissions }) ||
  !hasAccess(allowedRoles, permissions)
 ) {
  return {
   redirect: {
    destination: Routes.login,
    permanent: false,
   },
  };
 }
 return {
  props: {
   userPermissions: permissions,
  },
 };
};
