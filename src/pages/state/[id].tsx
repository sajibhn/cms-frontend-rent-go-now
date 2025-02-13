import { useStateQuery } from '@/api/data/state';
import { useParams } from 'next/navigation';
import React from 'react';
import CreateOrUpdateForm from '../../components/state/create-or-update-state';
import { ContentLayout } from '@/components/ui/content-layout';

const UpdateState = () => {
 const params = useParams();
 const stateId = params?.id;

 const { data, loading, error } = useStateQuery({
  id: stateId,
  options: {
   enabled: Boolean(stateId),
  },
 });

 return (
  <ContentLayout title='Update State' loading={loading} error={error}>
   <CreateOrUpdateForm initialValues={data} />
  </ContentLayout>
 );
};

export default UpdateState;
