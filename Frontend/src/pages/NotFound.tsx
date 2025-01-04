import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="text-center text-white">
        <h1 className="text-9xl font-extrabold tracking-wide">404</h1>
        <p className="text-2xl font-medium mt-4">
          Oops! Page Not Found
        </p>
        <p className="text-gray-400 mt-2">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="px-6 py-3 text-black bg-white hover:bg-gray-200 rounded-md text-lg font-semibold shadow-lg"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
