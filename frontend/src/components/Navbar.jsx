import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              Lab Evaluation System
            </Link>
          </div>
          {user && (
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">
                Welcome, <span className="font-medium">{user.role}</span>
              </span>
              <button
                onClick={logout}
                className="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
