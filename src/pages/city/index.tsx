import { useCitiesQuery } from '@/api/data/city';
import { DataTable } from '@/components/reusable/data-table';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/components/ui/content-layout';
import { City, State } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useRouter } from 'next/router';

const CityPage = () => {
 const router = useRouter();

 const { data, initialLoading, error } = useCitiesQuery();

 const columns: ColumnDef<City>[] = [
  {
   accessorKey: 'name',
   header: 'Name',
  },
  {
   accessorKey: 'state',
   header: 'State',
   cell: ({ getValue }) => {
    const state = getValue() as State;
    return state.name;
   },
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
      onClick={() => router.push(`/city/${original.id}`)}
     >
      Edit
     </Button>
    );
   },
  },
 ];

 return (
  <ContentLayout title='City' loading={initialLoading} error={error}>
   <div className='container mx-auto py-10'>
    <div className='mb-4 flex w-full justify-end'>
     <Button className='text-left' onClick={() => router.push('/city/create')}>
      Create
     </Button>
    </div>
    <DataTable columns={columns} data={data} />
   </div>
  </ContentLayout>
 );
};

export default CityPage;
