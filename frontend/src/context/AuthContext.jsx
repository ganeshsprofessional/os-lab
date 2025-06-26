import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      try {
        // Decode token to get user role and id (simple way)
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUser({ role: decoded.role, id: decoded.id });
      } catch (error) {
        console.error("Failed to parse token", error);
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (username, password) => {
    try {
      const { data } = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser({
        role: data.role,
        user: JSON.parse(atob(data.token.split(".")[1])),
      });

      // Redirect based on role
      if (data.role === "student") navigate("/student/dashboard");
      if (data.role === "teacher") navigate("/teacher/dashboard");
      // Add admin redirect if needed
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.error || error.message
      );
      throw new Error(error.response?.data?.error || "Login Failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  const value = { user, token, login, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
