import React from 'react';
import {
  LiaCaretLeftSolid,
  LiaCaretRightSolid,
  LiaBellSolid,
  LiaUserFriendsSolid,
} from 'react-icons/lia';
import { Link, useNavigate } from 'react-router-dom';
import RenderInvites from '../renderes/RenderInvites';
import api from '../../api/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import {
  toggleInvites,
  toggleMenu,
  toggleNotifications,
  toggleUserMenu,
} from '../../store/Slices/uiSlice';
import IconContainer from '../reusables/IconContainer';
import { markAllNotificationsAsSeen } from '../../store/Slices/notificationsSlice';
import NotificationMenu from '../popups/notifications/NotificationMenu';
const UserMenu = () => {
  const dispatch = useDispatch();
  const { username, img } = useSelector((state) => state.user);
  const { menu, userMenu, notifications, invites } = useSelector(
    (state) => state.ui
  );
  const { unseenNotificationsCount, isUnseen } = useSelector(
    (state) => state.notifications
  );

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
      console.log('logged out');
      localStorage.clear();
      navigate('/login');
    } catch (err) {
      console.log('logout failed');
    }
  };
  const handleOpenNotifications = async () => {
    await api.get('/readNotifications', {
      withCredentials: true,
    });
    dispatch(toggleNotifications());
    dispatch(markAllNotificationsAsSeen());
  };
  const handleOpenInvites = () => {
    dispatch(toggleInvites());
  };
  return (
    <>
      {menu ? (
        // open menu
        <div
          className={`flex justify-center items-center w-full relative border-blue-700 h-[60px]`}
        >
          {/* user name + icon */}
          <div
            className="flex justify-start pl-[8px] items-center cursor-pointer w-1/2"
            onClick={() => dispatch(toggleUserMenu())}
          >
            <div
              className={`w-[40px] h-[40px] rounded-full overflow-hidden border border-blue-200 hover:border-blue-400  hover:shadow-lg ${
                userMenu ? 'outline outline-blue-400 shadow-lg' : 'shadow-md'
              }`}
            >
              <img alt="profile" className="w-full h-full" src={img} />
            </div>
            <div className="font-medium mx-4">{username}</div>
          </div>
          {/* notifications + invitations + open and close */}
          <div className={`flex justify-end mr-2 items-center w-1/2 gap-2`}>
            <div className="relative">
              <IconContainer
                handleClick={handleOpenNotifications}
                className={'w-1/2'}
              >
                <LiaBellSolid className="text-2xl" />
              </IconContainer>
              {isUnseen && (
                <div className="w-[15px] h-[15px] absolute bottom-[23px] left-[27.5px] rounded-full flex justify-center items-center bg-red-500">
                  <p className="text-xs">{unseenNotificationsCount}</p>
                </div>
              )}
            </div>
            <div className="relative">
              <IconContainer
                handleClick={handleOpenInvites}
                className={'w-1/2'}
              >
                <LiaUserFriendsSolid className="text-2xl" />
              </IconContainer>
            </div>
            {/* <div className="relative">
              <IconContainer
                handleClick={() => dispatch(toggleMenu())}
                className={'w-1/3'}
              >
                {menu ? <LiaCaretLeftSolid /> : <LiaCaretRightSolid />}{' '}
              </IconContainer>
            </div> */}
          </div>
        </div>
      ) : (
        // closed menu
        <div
          className={`flex justify-evenly items-center w-full relative border-t border-blue-700 flex-col h-[175px]`}
        >
          {/* user name + icon */}
          <div
            className="flex justify-center  items-center cursor-pointer  w-full"
            onClick={() => dispatch(toggleUserMenu())}
          >
            <div
              className={`w-[40px] h-[40px] rounded-full overflow-hidden border hover:border-blue-400 border-blue-200 relative hover:shadow-lg ${
                userMenu ? 'outline outline-blue-400 shadow-lg' : 'shadow-md'
              }`}
            >
              <img alt="profile" className="w-full h-full" src={img} />
            </div>
          </div>
          {/* notifications + open and close */}
          <IconContainer handleClick={() => dispatch(toggleNotifications())}>
            <LiaBellSolid className="text-2xl" />
          </IconContainer>
          <IconContainer handleClick={() => dispatch(toggleMenu())}>
            {menu ? <LiaCaretLeftSolid /> : <LiaCaretRightSolid />}{' '}
          </IconContainer>
        </div>
      )}

      {/* user menu */}
      {userMenu && (
        <div
          className={`w-[130px] h-[150px] border border-blue-200  bg-white  rounded-md absolute shadow-md z-50 ${
            menu ? 'top-[54px] left-[33px]' : 'top-[49px] left-[34px]'
          }`}
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
      )}
      {notifications && <NotificationMenu menu={menu} />}
      {invites && <RenderInvites />}
    </>
  );
};

export default UserMenu;
