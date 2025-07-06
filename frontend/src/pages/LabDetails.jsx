import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import Breadcrumbs from "../components/Breadcrumbs";

const LabDetails = () => {
  const { labId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lab, setLab] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLabDetails = async () => {
      try {
        const endpoint = `/${user.role}/labs/${labId}`;
        const { data } = await api.get(endpoint);

        setLab(data);
      } catch (error) {
        console.error("Failed to fetch lab details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLabDetails();
  }, [labId, user.role]);

  if (loading) return <div>Loading...</div>;
  if (!lab) return <div>Lab not found.</div>;

  const breadcrumbPaths = [
    { name: "Dashboard", path: `/${user.role}/dashboard` },
    { name: lab.lab_name, path: `/${user.role}/lab/${labId}` },
  ];

  // const onAddModule = () => {
  //   navigate("/teacher/");
  // };

  // Helper to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Breadcrumbs paths={breadcrumbPaths} />
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{lab.lab_name}</h1>
        <p className="text-gray-500 mt-1">{lab.course_id.code}</p>
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Modules</h2>
      {user.role === "teacher" && (
        <button className="mb-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
          Add New Module
        </button>
      )}

      <div className="space-y-4">
        {lab.modules.map((module) => (
          <div
            key={module._id}
            className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {module.title}
              </h3>
              <p className="text-gray-600">{module.description}</p>
            </div>
            {user.role === "student" && (
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                  module.status
                )}`}
              >
                {module.status.replace("-", " ")}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LabDetails;
