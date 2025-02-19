import '@/styles/globals.css';
import type { AppProps } from 'next/app';

import {
 HydrationBoundary,
 QueryClient,
 QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { usePathname } from 'next/navigation';

export default function App({ Component, pageProps }: AppProps) {
 const [queryClient] = useState(() => new QueryClient());
 const pathname = usePathname();

 const isLoginPage = pathname === '/login';

 return (
  <QueryClientProvider client={queryClient}>
   <HydrationBoundary state={pageProps.dehydratedState}>
    {isLoginPage ? (
     <>
      <Component {...pageProps} />
     </>
    ) : (
     <SidebarProvider>
      <AppSidebar />
      {/* <SidebarTrigger /> */}
      <Component {...pageProps} />
     </SidebarProvider>
    )}
    <ToastContainer />
   </HydrationBoundary>
   <ReactQueryDevtools />
  </QueryClientProvider>
 );
}
