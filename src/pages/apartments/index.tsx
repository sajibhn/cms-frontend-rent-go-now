import { useApartmentsQuery } from '@/api/data/apartments';
import { DataTable } from '@/components/reusable/data-table';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/components/ui/content-layout';
import { Apartments, Neighborhood } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useRouter } from 'next/router';

const ApartmentPage = () => {
	const router = useRouter();

	const { data, initialLoading, error } = useApartmentsQuery();

	const columns: ColumnDef<Apartments>[] = [
		{
			accessorKey: 'name',
			header: 'Name',
		},
		{
			accessorKey: 'address',
			header: 'Address',
		},
		{
			accessorKey: 'neighborhood',
			header: 'Neighborhood',
			cell: ({ getValue }) => {
				const neighborhood = getValue() as Neighborhood;
				return neighborhood.name;
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
						onClick={() => router.push(`/apartments/${original.id}`)}
					>
						Edit
					</Button>
				);
			},
		},
	];

	return (
		<ContentLayout title='Apartments' loading={initialLoading} error={error}>
			<div className='container mx-auto py-10'>
				<div className='mb-4 flex w-full justify-end'>
					<Button className='text-left' onClick={() => router.push('/apartments/create')}>
						Create
					</Button>
				</div>
				<DataTable columns={columns} data={data} />
			</div>
		</ContentLayout>
	);
};

export default ApartmentPage;
