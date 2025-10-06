import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-xl mb-4">Page Not Found</p>
      <Link to="/" className="text-blue-500 underline">
        Go Back Home
      </Link>
    </div>
  );
}
