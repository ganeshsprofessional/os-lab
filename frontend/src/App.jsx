import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import LabDetails from "./pages/LabDetails";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />

          {/* Routes with Navbar */}
          <Route element={<Layout />}>
            {/* Student Routes */}
            <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
              <Route path="student/dashboard" element={<StudentDashboard />} />
              <Route path="student/lab/:labId" element={<LabDetails />} />
            </Route>

            {/* Teacher Routes */}
            <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
              <Route path="teacher/dashboard" element={<TeacherDashboard />} />
              <Route path="teacher/lab/:labId" element={<LabDetails />} />
            </Route>
          </Route>

          {/* Add a 404 or unauthorized page here */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

// A component to handle the initial redirect after login
const HomeRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role === "student") return <Navigate to="/student/dashboard" />;
  if (user.role === "teacher") return <Navigate to="/teacher/dashboard" />;
  return <Navigate to="/login" />;
};

export default App;
