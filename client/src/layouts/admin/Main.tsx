import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useLoading } from "@/contexts/LoadingContext";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import NavBar from "./Navbar";

const Main = () => {
  const { isLoading } = useLoading();
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <NavBar />
        {isLoading && (
          <div className="flex items-center justify-center min-h-[calc(100vh)] bg-gray-100">
            <img
              src="/images/logo.png"
              alt="logo-loader"
              className="w-20 h-20 rounded-full logo-loader"
            />
          </div>
        )}
        <main className={`mt-[80px] m-4 ${isLoading ? "hidden" : ""}`}>
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Main;
