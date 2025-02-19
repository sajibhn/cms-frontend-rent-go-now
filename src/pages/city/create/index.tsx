import { GetServerSideProps } from 'next';
import {
 allowedRoles,
 getAuthCredentials,
 hasAccess,
 isAuthenticated,
} from '@/utils/auth';
import { Routes } from '@/utils/routes';
import CreateOrUpdateForm from '@/components/city/create-or-update-city';
import { ContentLayout } from '@/components/ui/content-layout';

const CityCreate = () => {
 return (
  <ContentLayout title='Create City'>
   <CreateOrUpdateForm />
  </ContentLayout>
 );
};

export default CityCreate;

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
