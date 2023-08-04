import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { useDispatch } from 'react-redux';
import {
  resetSettings,
  setCurrent,
  toggleUserMenu,
} from '../../store/Slices/uiSlice';
import { toast } from 'react-toastify';
import { clearUser } from '../../store/Slices/userSlice';

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
      dispatch(clearUser());
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
        <p
          onClick={() => {
            dispatch(setCurrent({ current: 'profile', second: 'profile' }));
            dispatch(toggleUserMenu());
          }}
        >
          Profile
        </p>
      </button>
      <button className="w-full h-[50px] border-b border-blue-300 justify-center items-center flex hover:bg-blue-200">
        <p
          onClick={() => {
            dispatch(setCurrent({ current: 'profile', second: 'settings' }));
            dispatch(toggleUserMenu());
          }}
        >
          Settings
        </p>
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
