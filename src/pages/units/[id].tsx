import { useUnitQuery } from '@/api/data/units';
import CreateOrUpdateForm from '@/components/units/create-or-update-units';
import { ContentLayout } from '@/components/ui/content-layout';
import { useParams } from 'next/navigation';

const UpdateUnit = () => {
	const params = useParams();
	const unitId = params?.id;

	const { data, initialLoading, error } = useUnitQuery({
		id: unitId,
		options: {
			enabled: Boolean(unitId),
			cacheTime: 0
		},
	});

	return (
		<ContentLayout title='Update Unit' loading={initialLoading} error={error}>
			<CreateOrUpdateForm initialValues={data} />
		</ContentLayout>
	);
};

export default UpdateUnit;
