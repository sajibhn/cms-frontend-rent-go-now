import { LoadingSpinner } from './loading-spinner';

const ContainerLoading = () => {
 return (
  <div className='flex h-[90vh] items-center justify-center'>
   <LoadingSpinner size={40} />
  </div>
 );
};

export default ContainerLoading;
