import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router";

export function AppSidebar() {
  const location = useLocation();
  const items = [
    {
      title: "Inicio",
      url: "/",
    },
    {
      title: "Categorías",
      url: "/categories",
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent className="mt-5">
        <SidebarGroup>
          <SidebarGroupLabel>Menú</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={<Link to={item.url}>{item.title}</Link>}
                    isActive={location.pathname === item.url}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
