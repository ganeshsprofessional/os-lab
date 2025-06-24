import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import StudentHome from "./pages/StudentHome";
import TeacherHome from "./pages/TeacherHome";
// import AdminHome from "./pages/AdminHome";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/student" element={<StudentHome />} />
        <Route path="/teacher" element={<TeacherHome />} />
        {/* <Route path="/admin" element={<AdminHome />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
