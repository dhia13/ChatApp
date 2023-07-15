// import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
const GoogleLogin = () => {
  return (
    <div
      className="flex items-center justify-center w-72 px-4 py-2 mt-2 space-x-3 text-sm text-center
  bg-blue-500 text-primary-text transition-colors duration-200 transform border rounded-lg
    dark:border-secondary-border hover:bg-gray-600 dark:hover:bg-gray-700 cursor-pointer"
    >
      <Link to="#">
        <>
          <FcGoogle size={24} />
          <span className="text-sm text-white dark:text-gray-200 font-semibold">
            Login with Google
          </span>
        </>
      </Link>
    </div>
  );
};
export default GoogleLogin;
