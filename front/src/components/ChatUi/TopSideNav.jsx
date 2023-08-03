import React from 'react';
import { LiaBellSolid, LiaUserFriendsSolid } from 'react-icons/lia';
import api from '../../api/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import {
  toggleInvites,
  toggleNotifications,
  toggleUserMenu,
} from '../../store/Slices/uiSlice';
import IconContainer from '../reusables/IconContainer';
import { markAllNotificationsAsSeen } from '../../store/Slices/notificationsSlice';
import NotificationMenu from '../popups/notifications/NotificationMenu';
import UserMenu from '../popups/UserMenu';
import ContactAttempt from '../popups/ContactAttempt';
import { markInviteAsSeen } from '../../store/Slices/contactsSlice';
const TopSideNav = () => {
  const dispatch = useDispatch();
  const { username, img, email } = useSelector((state) => state.user);
  const { menu, userMenu, notifications, invites } = useSelector(
    (state) => state.ui
  );
  const { unseenNotificationsCount, isUnseen } = useSelector(
    (state) => state.notifications
  );
  const { unseenInvites, unseenInvitesCount } = useSelector(
    (state) => state.contacts.invites
  );
  const handleOpenNotifications = async () => {
    await api.get('/readNotifications', {
      withCredentials: true,
    });
    dispatch(toggleNotifications());
    dispatch(markAllNotificationsAsSeen());
  };
  const handleOpenInvites = () => {
    dispatch(toggleInvites());
    dispatch(markInviteAsSeen());
    const markInviteInDb = async () => {
      try {
        await api.put('/invitesSeen', { id: null }, { withCredentials: true });
      } catch (error) {
        console.error('Error marking invite in the database:', error);
      }
    };
    markInviteInDb();
  };
  return (
    <>
      <div
        className={`flex justify-center items-center w-full border-b-2 border-blue-300 relative h-[80px] bg-blue-50`}
      >
        {/* user name + icon */}
        <div
          className="flex justify-start pl-4 items-center cursor-pointer "
          onClick={() => dispatch(toggleUserMenu())}
        >
          <div
            className={`w-[62px] h-[62px] rounded-full overflow-hidden border border-blue-200 hover:border-blue-400  hover:shadow-lg ${
              userMenu ? 'outline outline-blue-400 shadow-lg' : 'shadow-md'
            }`}
          >
            <img alt="profile" className="w-full h-full" src={img} />
          </div>
          <div className="flex justify-start items-start flex-col">
            <div className="font-medium mx-4">{username}</div>
            <div className="font-normal text-sm mx-4">{email}</div>
          </div>
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
            <IconContainer handleClick={handleOpenInvites} className={'w-1/2'}>
              <LiaUserFriendsSolid className="text-2xl" />
            </IconContainer>
            {unseenInvites && (
              <div className="w-[15px] h-[15px] absolute bottom-[23px] left-[27.5px] rounded-full flex justify-center items-center bg-red-500">
                <p className="text-xs">{unseenInvitesCount}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* user menu */}
      {userMenu && <UserMenu />}
      {notifications && <NotificationMenu menu={menu} />}
      {invites && <ContactAttempt />}
    </>
  );
};

export default TopSideNav;
