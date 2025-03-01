import { useApartmentQuery } from '@/api/data/apartments';
import CreateOrUpdateForm from '@/components/apartments/create-or-update-apartment';
import { ContentLayout } from '@/components/ui/content-layout';
import { useParams } from 'next/navigation';

const UpdateApartment = () => {
	const params = useParams();
	const apartmentId = params?.id;

	const { data, initialLoading, error } = useApartmentQuery({
		id: apartmentId,
		options: {
			enabled: Boolean(apartmentId),
		},
	});

	return (
		<ContentLayout title='Update Apartment' loading={initialLoading} error={error}>
			<CreateOrUpdateForm initialValues={data} />
		</ContentLayout>
	);
};

export default UpdateApartment;
