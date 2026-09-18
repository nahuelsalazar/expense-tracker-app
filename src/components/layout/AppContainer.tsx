import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

type AppContainerProps = {
  children: ReactNode;
};

export function AppContainer({ children }: AppContainerProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 w-full relative">
        <SidebarTrigger className="fixed md:absolute top-4 left-4 z-10 bg-background/20 backdrop-blur-sm rounded-md" />
        {children}
      </main>
    </SidebarProvider>
  );
}
