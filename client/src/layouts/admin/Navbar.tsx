import { Icons } from "@/components/ui/icons";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { TypographyH3 } from "@/components/ui/typographyH3";
import { useLoading } from "@/contexts/LoadingContext";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const pathname = location.pathname;
  let pageTitle = "";
  if (pathname === "/admin") {
    pageTitle = "Dashboard";
  } else if (pathname.includes("/edit")) {
    const routeName = pathname.split("/")[2];
    pageTitle = `Update ${routeName.charAt(0).toUpperCase() + routeName.slice(1)}`;
  } else if (pathname.includes("/create")) {
    const routeName = pathname.split("/")[2];
    pageTitle = `Create ${routeName.charAt(0).toUpperCase() + routeName.slice(1)}`;
  } else if (pathname.match(/\/admin\/\w+\/\d+/)) {
    const routeName = pathname.split("/")[2];
    pageTitle = `${routeName.charAt(0).toUpperCase() + routeName.slice(1)} Details`;
  } else {
    const routeName = pathname.split("/")[2];
    pageTitle = `${routeName.charAt(0).toUpperCase() + routeName.slice(1)} Lists`;
  }
  const navigate = useNavigate();
  const { isLoading } = useLoading();
  const userName = localStorage.getItem("userName");
  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/admin/login");
  };

  return (
    <>
      {isLoading && (
        <div className="fixed top-0 left-0 md:left-[255px] w-full h-1 bg-gray-200 z-50">
          <div className="loading-bar w-full h-full bg-blue-500 animate-pulse" />
        </div>
      )}
      <header
        className={cn(
          "fixed top-0 left-0 md:left-[255px] right-0 z-40 bg-white border-b",
          "flex h-16 shrink-0 items-center gap-2 px-4 shadow-sm"
        )}
      >
        <SidebarTrigger className="-ml-1 md:hidden" />

        <TypographyH3 className="hidden sm:block text-[var(--main-color)]">
          {pageTitle}
        </TypographyH3>

        <div className="ml-auto flex items-center gap-4">
          <button className="flex flex-col items-center text-gray-500 hover:text-black">
            <Icons.settings size={16} />
            <span className="text-sm">{userName}</span>
          </button>
          <button className="flex flex-col items-center text-gray-500 hover:text-black">
            <Icons.bell size={16} />
            <span className="text-sm">Notification</span>
          </button>
          <button className="flex flex-col items-center text-gray-500 hover:text-black">
            <Icons.mail size={16} />
            <span className="text-sm">Mail</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex flex-col items-center text-gray-500 hover:text-black mr-3"
          >
            <Icons.logout size={16} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </header>

      <div className="sm:hidden px-4 py-2 border-b bg-white mt-16">
        <TypographyH3 className="text-[var(--main-color)]">
          {pageTitle}
        </TypographyH3>
      </div>
    </>
  );
};

export default Navbar;
