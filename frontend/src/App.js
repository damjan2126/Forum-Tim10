import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthRoutes from "./auth/AuthRoute";
import PrivateRoutes from "./auth/PrivateRoute";
import Home from "./pages/home";
import Login from "./pages/login";
import Registration from "./pages/registration";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route element={<AuthRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
