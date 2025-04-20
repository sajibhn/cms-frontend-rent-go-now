import { Building2, LayoutDashboard } from 'lucide-react';

import {
 Sidebar,
 SidebarContent,
 SidebarGroup,
 SidebarGroupContent,
 SidebarHeader,
 SidebarMenu,
 SidebarMenuButton,
 SidebarMenuItem,
} from '@/components/ui/sidebar';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const items = [
 {
  title: 'Dashboard',
  url: '/',
  icon: LayoutDashboard,
 },
 {
  title: 'State',
  url: '/state',
  icon: Building2,
 },
 {
  title: 'City',
  url: '/city',
  icon: Building2,
 },
 {
  title: 'Neighborhood',
  url: '/neighborhood',
  icon: Building2,
 },
 {
  title: 'Apartments',
  url: '/apartments',
  icon: Building2,
 },
 {
  title: 'Units',
  url: '/units',
  icon: Building2,
 },
];

export function AppSidebar() {
 const pathname = usePathname();

 return (
  <Sidebar>
   <SidebarHeader>
    <p>Rent Go Now</p>
   </SidebarHeader>
   <SidebarContent>
    <SidebarGroup>
     <SidebarGroupContent>
      <SidebarMenu>
       {items.map((item) => (
        <SidebarMenuItem key={item.title}>
         <SidebarMenuButton asChild isActive={item.url === pathname}>
          <Link href={item.url}>
           <item.icon />
           <span>{item.title}</span>
          </Link>
         </SidebarMenuButton>
        </SidebarMenuItem>
       ))}
      </SidebarMenu>
     </SidebarGroupContent>
    </SidebarGroup>
   </SidebarContent>
  </Sidebar>
 );
}
