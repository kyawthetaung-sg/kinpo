import Error404 from "@/components/errors/Error404";
import { useLocation } from "react-router-dom";

const Error = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.includes("admin");
  const redirectTo = isAdminRoute ? "/admin" : "/";

  return <Error404 redirectTo={redirectTo} />;
};

export default Error;
