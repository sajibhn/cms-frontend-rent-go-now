import { useUnitsQuery } from '@/api/data/units';
import { DataTable } from '@/components/reusable/data-table';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/components/ui/content-layout';
import { Apartments, Unit } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useRouter } from 'next/router';

const ApartmentPage = () => {
	const router = useRouter();

	const { data, initialLoading, error } = useUnitsQuery();

	const columns: ColumnDef<Unit>[] = [
		{
			accessorKey: 'name',
			header: 'Name',
		},

		{
			accessorKey: 'apartment',
			header: 'Apartment',
			cell: ({ getValue }) => {
				const apartment = getValue() as Apartments;
				return apartment.name;
			},
		},
		{
			accessorKey: 'price',
			header: 'Price',
		},
		{
			accessorKey: 'bedrooms',
			header: 'Bedrooms',
		},
		{
			accessorKey: 'floorArea',
			header: 'Floor Area',
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
						onClick={() => router.push(`/units/${original.id}`)}
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
					<Button className='text-left' onClick={() => router.push('/units/create')}>
						Create
					</Button>
				</div>
				<DataTable columns={columns} data={data} />
			</div>
		</ContentLayout>
	);
};

export default ApartmentPage;
