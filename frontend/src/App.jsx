import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";


export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  return (
    <div>
      <nav>
        <Link to="/">Home</Link> |{" "}

        {!token && (
          <>
            <Link to="/signup">Signup</Link> |{" "}
            <Link to="/login">Login</Link> |{" "}
          </>
        )}

        {token && (
          <>
            <Link to="/profile">Profile</Link> |{" "}
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />

      </Routes>
    </div>
  );
}
