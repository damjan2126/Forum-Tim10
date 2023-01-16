import { Navigate, Outlet } from "react-router-dom";

const AuthRoutes = () => {
  const accessToken = localStorage.getItem("accessToken");
  return !accessToken ? <Outlet /> : <Navigate to="/" />;
};

export default AuthRoutes;
