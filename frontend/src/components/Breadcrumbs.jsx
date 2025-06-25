import { Link } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

const Breadcrumbs = ({ paths }) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-4">
        {paths.map((path, index) => (
          <li key={path.name}>
            <div className="flex items-center">
              {index > 0 && (
                <ChevronRightIcon
                  className="flex-shrink-0 h-5 w-5 text-gray-400 mr-4"
                  aria-hidden="true"
                />
              )}
              <Link
                to={path.path}
                className={`text-sm font-medium ${
                  index === paths.length - 1
                    ? "text-gray-800"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {path.name}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
