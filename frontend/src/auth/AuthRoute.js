import { Navigate, Outlet } from "react-router-dom";

const AuthRoutes = () => {
  const accessToken = localStorage.getItem("accessToken");
  console.log(accessToken);
  return !accessToken ? <Outlet /> : <Navigate to="/" />;
};

export default AuthRoutes;
