import { ContentLayout } from '@/components/ui/content-layout';
import {
 allowedRoles,
 getAuthCredentials,
 hasAccess,
 isAuthenticated,
} from '@/utils/auth';
import { Routes } from '@/utils/routes';
import { GetServerSideProps } from 'next';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/reusable/data-table';
import { format } from 'date-fns';
import { useStatesQuery } from '@/api/data/state';
import { State } from '@/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';

const StatePage = () => {
 const router = useRouter();

 const { data, initialLoading, error } = useStatesQuery();

 const columns: ColumnDef<State>[] = [
  {
   accessorKey: 'name',
   header: 'Name',
  },
  {
   accessorKey: 'url',
   header: 'Url',
  },
  {
   accessorKey: 'createdAt',
   header: 'Created At',
   cell: ({ getValue }) => {
    const value = getValue() as string;
    return format(value, 'dd-MMM-yyyy');
   },
  },
  {
   accessorKey: 'updatedAt',
   header: 'Updated At',
   cell: ({ getValue }) => {
    const value = getValue() as string;
    return format(value, 'dd-MMM-yyyy');
   },
  },
  {
   header: 'Edit',
   cell({ row: { original } }) {
    return (
     <Button
      variant='secondary'
      size='lg'
      onClick={() => router.push(`/state/${original.id}`)}
     >
      Edit
     </Button>
    );
   },
  },
 ];

 return (
  <ContentLayout title='State' loading={initialLoading} error={error}>
   <div className='container mx-auto py-10'>
    <div className='mb-4 flex w-full justify-end'>
     <Button className='text-left' onClick={() => router.push('/state/create')}>
      Create
     </Button>
    </div>
    <DataTable columns={columns} data={data} />
   </div>
  </ContentLayout>
 );
};

export default StatePage;

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
