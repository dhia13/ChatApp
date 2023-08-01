import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import api from '../../api/axiosInstance';

const HomeNavbar = ({ isTokenChecked, setIsTokenChecked }) => {
  const handleLogout = async () => {
    try {
      await api.put(
        '/logout',
        {},
        {
          withCredentials: true,
        }
      );
      localStorage.clear();
      setIsTokenChecked(false);
    } catch (err) {}
  };
  return (
    <div className="w-full h-[80px] flex justify-start items-center bg-gray-500">
      <div to="/" className="w-1/2">
        <Logo width="60" />
      </div>
      <div className="flex justify-end items-center h-full gap-4 w-1/2">
        <button className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
          <Link to="/about">About</Link>
        </button>
        <div className="mx-4 h-full flex justify-center items-center">
          <button className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
            <Link to="/contact">Contact</Link>
          </button>
        </div>
        {isTokenChecked ? (
          <>
            <div className="mx-4 h-full flex justify-center items-center">
              <Link
                to="/chat"
                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Chat
              </Link>
            </div>
            <div
              className="mx-4 h-full flex justify-center items-center"
              onClick={handleLogout}
            >
              <button className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mx-4 h-full flex justify-center items-center">
              <Link to="/register">
                <button className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                  Register
                </button>
              </Link>
            </div>
            <div className="mx-4 h-full flex justify-center items-center">
              <Link to="/login">
                <button className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                  Login
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomeNavbar;
