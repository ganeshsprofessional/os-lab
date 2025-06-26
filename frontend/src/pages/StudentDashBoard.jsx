import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";

const StudentDashboard = () => {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const endpoint = "/student/labs";
        const { data } = await api.get(endpoint);
        setLabs(data);
      } catch (error) {
        console.error("Failed to fetch labs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLabs();
  }, [user.role]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Labs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {labs.map((lab) => (
          <Link
            key={lab._id}
            to={`/${user.role}/lab/${lab._id}`}
            className="block"
          >
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-semibold text-indigo-700">
                {lab.lab_name}
              </h2>
              <p className="text-gray-500">{lab.course_id.code}</p>
              <p className="mt-2 text-gray-600">
                {lab.course_id.description.substring(0, 100)}...
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;
