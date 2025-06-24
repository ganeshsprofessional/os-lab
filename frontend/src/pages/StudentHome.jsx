import { useEffect, useState } from "react";
import axios from "../api";

export default function StudentHome() {
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    axios.get("/api/labs").then((res) => setLabs(res.data));
  }, []);

  const handleLabClick = async (lab) => {
    setSelectedLab(lab);
    const res = await axios.get(`/api/modules?lab_id=${lab._id}`);
    setModules(res.data);
    setSelectedModule(null);
    setQuestions([]);
  };

  const handleModuleClick = async (module) => {
    setSelectedModule(module);
    const res = await axios.get(`/api/questions?module_id=${module._id}`);
    setQuestions(res.data);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
      <div className="flex gap-8">
        <div>
          <h2 className="font-semibold mb-2">Labs</h2>
          <ul>
            {labs.map((lab) => (
              <li
                key={lab._id}
                className={`cursor-pointer ${
                  selectedLab?._id === lab._id ? "font-bold" : ""
                }`}
                onClick={() => handleLabClick(lab)}
              >
                {lab.course_id.title}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-semibold mb-2">Modules</h2>
          <ul>
            {modules.map((module) => (
              <li
                key={module._id}
                className={`cursor-pointer ${
                  selectedModule?._id === module._id ? "font-bold" : ""
                }`}
                onClick={() => handleModuleClick(module)}
              >
                {module.title}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-semibold mb-2">Questions</h2>
          <ul>
            {questions.map((q) => (
              <li key={q._id}>
                {q.title}: {q.description}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
