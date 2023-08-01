import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { useDispatch } from 'react-redux';
import { resetSettings } from '../../store/Slices/uiSlice';
import { toast } from 'react-toastify';

const UserMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      dispatch(resetSettings());
      navigate('/login');
    } catch (err) {
      const notify = () =>
        toast.error('Logout Faild', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      notify();
    }
  };
  return (
    <div
      className={`w-[130px] h-[150px] border border-blue-200  bg-white  rounded-md absolute shadow-md z-50 top-[75px] left-[45px]`}
    >
      <button className="w-full h-[50px] border-b border-blue-300 justify-center items-center flex hover:bg-blue-200 rounded-t-md">
        <Link to="/profile">Profile</Link>
      </button>
      <button className="w-full h-[50px] border-b border-blue-300 justify-center items-center flex hover:bg-blue-200">
        <Link to="/settings">Settings</Link>
      </button>
      <button
        className="w-full h-[50px]  justify-center items-center flex hover:bg-blue-200 rounded-b-md"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default UserMenu;
