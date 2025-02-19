import { useCityQuery } from '@/api/data/city';
import CreateOrUpdateForm from '@/components/city/create-or-update-city';
import { ContentLayout } from '@/components/ui/content-layout';
import { useParams } from 'next/navigation';

const UpdateCity = () => {
 const params = useParams();
 const cityId = params?.id;

 const { data, initialLoading, error } = useCityQuery({
  id: cityId,
  options: {
   enabled: Boolean(cityId),
  },
 });

 return (
  <ContentLayout title='Update City' loading={initialLoading} error={error}>
   <CreateOrUpdateForm initialValues={data} />
  </ContentLayout>
 );
};

export default UpdateCity;
