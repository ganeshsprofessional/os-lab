import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusIcon, BookOpenIcon, UsersIcon } from "@heroicons/react/24/solid";
import api from "../services/api";
import Spinner from "../components/ui/Spinner"; // A simple spinner component

const TeacherDashboard = () => {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // This would be used to control a "Create Lab" modal
  // const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchLabs = async () => {
      setLoading(true);
      setError("");
      try {
        // The API endpoint for teachers to get their labs
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
  }, []); // Empty dependency array ensures this runs only once on mount

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
          <div className="mt-6">
            <button
              type="button"
              // onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Create New Lab
            </button>
          </div>
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
                  {lab.course_id.title}
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
        {labs.length > 0 && (
          <button
            type="button"
            // onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Create New Lab
          </button>
        )}
      </div>

      {renderContent()}

      {/* 
            Future Implementation: A modal for creating a new lab
            {isModalOpen && (
                <CreateLabModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onLabCreated={(newLab) => {
                        setLabs(prevLabs => [...prevLabs, newLab]);
                        setIsModalOpen(false);
                    }}
                />
            )} 
            */}
    </div>
  );
};

export default TeacherDashboard;
