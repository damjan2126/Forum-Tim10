import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthRoutes from "./auth/AuthRoute";
import PrivateRoutes from "./auth/PrivateRoute";
import Home from "./pages/home";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Registration from "./pages/registration";
import Theme from "./pages/theme";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/:theme_name" element={<Theme />} />
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
