import { SiFacebook } from "react-icons/si";
import { Link } from "react-router-dom";
const FacebookLogin = () => {
  return (
    <div
      className="flex items-center justify-center w-72 px-4 py-2 mt-2 space-x-3 text-sm text-center
    bg-blue-500 text-white transition-colors duration-200 transform border rounded-lg
     dark:text-gray-300 dark:border-gray-300 hover:bg-gray-600 dark:hover:bg-gray-700 cursor-pointer"
    >
      <Link to="#">
        <>
          <SiFacebook size={24} color="blue" />
          <span className="text-sm text-white dark:text-gray-200">
            Login with Facebook
          </span>
        </>
      </Link>
    </div>
  );
};
export default FacebookLogin;
