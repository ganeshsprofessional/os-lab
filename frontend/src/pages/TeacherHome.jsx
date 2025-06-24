import { useEffect, useState } from "react";
import axios from "../api";

export default function TeacherHome() {
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newQuestionTitle, setNewQuestionTitle] = useState("");
  const [newQuestionDesc, setNewQuestionDesc] = useState("");

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

  const handleAddModule = async () => {
    if (!newModuleTitle || !selectedLab) return;
    await axios.post("/api/modules", {
      lab_id: selectedLab._id,
      title: newModuleTitle,
    });
    handleLabClick(selectedLab);
    setNewModuleTitle("");
  };

  const handleAddQuestion = async () => {
    if (!newQuestionTitle || !selectedModule) return;
    await axios.post("/api/questions", {
      module_id: selectedModule._id,
      title: newQuestionTitle,
      description: newQuestionDesc,
    });
    handleModuleClick(selectedModule);
    setNewQuestionTitle("");
    setNewQuestionDesc("");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
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
          <input
            className="border p-1 mt-2"
            value={newModuleTitle}
            onChange={(e) => setNewModuleTitle(e.target.value)}
            placeholder="New Module Title"
          />
          <button
            className="ml-2 bg-green-500 text-white px-2 py-1 rounded"
            onClick={handleAddModule}
          >
            Add Module
          </button>
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
          <input
            className="border p-1 mt-2"
            value={newQuestionTitle}
            onChange={(e) => setNewQuestionTitle(e.target.value)}
            placeholder="New Question Title"
          />
          <input
            className="border p-1 mt-2"
            value={newQuestionDesc}
            onChange={(e) => setNewQuestionDesc(e.target.value)}
            placeholder="Description"
          />
          <button
            className="ml-2 bg-blue-500 text-white px-2 py-1 rounded"
            onClick={handleAddQuestion}
          >
            Add Question
          </button>
        </div>
      </div>
    </div>
  );
}
