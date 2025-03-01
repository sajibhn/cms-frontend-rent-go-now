import { useNeighborhoodsQuery } from '@/api/data/neighborhood';
import { DataTable } from '@/components/reusable/data-table';
import { Button } from '@/components/ui/button';
import { ContentLayout } from '@/components/ui/content-layout';
import { City, Neighborhood } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useRouter } from 'next/router';

const NeighborhoodPage = () => {
	const router = useRouter();

	const { data, initialLoading, error } = useNeighborhoodsQuery();

	const columns: ColumnDef<Neighborhood>[] = [
		{
			accessorKey: 'name',
			header: 'Name',
		},
		{
			accessorKey: 'city',
			header: 'City',
			cell: ({ getValue }) => {
				const city = getValue() as City;
				return city.name;
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
						onClick={() => router.push(`/neighborhood/${original.id}`)}
					>
						Edit
					</Button>
				);
			},
		},
	];

	return (
		<ContentLayout title='Neighborhood' loading={initialLoading} error={error}>
			<div className='container mx-auto py-10'>
				<div className='mb-4 flex w-full justify-end'>
					<Button className='text-left' onClick={() => router.push('/neighborhood/create')}>
						Create
					</Button>
				</div>
				<DataTable columns={columns} data={data} />
			</div>
		</ContentLayout>
	);
};

export default NeighborhoodPage;
