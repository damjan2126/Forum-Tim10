import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = () => {
  const accessToken = localStorage.getItem("accessToken");
  console.log(accessToken);
  return accessToken ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
