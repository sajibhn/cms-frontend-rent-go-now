import ContainerError from '../reusable/container-error';
import ContainerLoading from '../reusable/container-loading';
import { Navbar } from './navbar';

interface ContentLayoutProps {
 title: string;
 children: React.ReactNode;
 loading?: boolean;
 error?: Error | null;
}

export function ContentLayout({
 title,
 children,
 loading = false,
 error = null,
}: ContentLayoutProps) {
 return (
  <div className='w-full'>
   <Navbar title={title} />
   {loading && <ContainerLoading />}
   {error && <ContainerError />}
   {!loading && !error && (
    <div className='container px-4 pb-8 pt-8 sm:px-8'>{children}</div>
   )}
  </div>
 );
}
