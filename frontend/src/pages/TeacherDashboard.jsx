import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusIcon, BookOpenIcon, UsersIcon } from "@heroicons/react/24/solid";
import api from "../services/api";
import Spinner from "../components/ui/Spinner";

const TeacherDashboard = () => {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLabs = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/teacher/labs");
        console.log(res);
        setLabs(res.data);
      } catch (err) {
        setError("Failed to fetch your labs. Please refresh the page.");
        console.error("Error fetching teacher labs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLabs();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <Spinner />;
    }

    if (error) {
      return (
        <div className="text-center p-8 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      );
    }

    if (labs.length === 0) {
      return (
        <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
          <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-xl font-medium text-gray-900">
            No Labs Found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            You have not been assigned to any labs yet.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {labs.map((lab) => (
          <Link
            key={lab._id}
            to={`/teacher/lab/${lab._id}`}
            className="group block"
          >
            <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col justify-between transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
              <div>
                <h2 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                  {lab.lab_name}
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">
                  {lab.course_id.code}
                </p>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-600">
                <UsersIcon className="h-5 w-5 mr-2 text-gray-400" />
                <span>
                  {lab.students.length} Student
                  {lab.students.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
      </div>

      {renderContent()}
    </div>
  );
};

export default TeacherDashboard;
