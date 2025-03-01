import { useNeighborhoodQuery } from '@/api/data/neighborhood';
import CreateOrUpdateForm from '@/components/neighborhood/create-or-update-neighborhood';
import { ContentLayout } from '@/components/ui/content-layout';
import { useParams } from 'next/navigation';

const UpdateNeighborhood = () => {
 const params = useParams();
 const neighborhoodId = params?.id;

 const { data, initialLoading, error } = useNeighborhoodQuery({
  id: neighborhoodId,
  options: {
   enabled: Boolean(neighborhoodId),
  },
 });

 return (
  <ContentLayout title='Update Neighborhood' loading={initialLoading} error={error}>
   <CreateOrUpdateForm initialValues={data} />
  </ContentLayout>
 );
};

export default UpdateNeighborhood;
