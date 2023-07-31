import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  toggleAddChat,
  toggleAddContact,
  toggleInvites,
  toggleNotifications,
  toggleUserMenu,
} from '../../store/Slices/uiSlice';
import NewContact from './NewContact';
import NewChat from '../ChatUi/NewChat';

const HiddenMenus = () => {
  const dispatch = useDispatch();
  const { addChat, addContact, userMenu, notifications, invites } = useSelector(
    (state) => state.ui
  );
  return (
    <>
      {userMenu && (
        <div
          className="w-screen h-screen absolute bg-black opacity-20 z-40"
          onClick={() => dispatch(toggleUserMenu())}
        ></div>
      )}
      {invites && (
        <div
          className="w-screen h-screen absolute bg-black opacity-20 z-40"
          onClick={() => dispatch(toggleInvites())}
        ></div>
      )}
      {notifications && (
        <div
          className="w-screen h-screen absolute bg-black opacity-20 z-40"
          onClick={() => dispatch(toggleNotifications())}
        ></div>
      )}
      {addChat && (
        <div
          className="w-screen h-screen absolute bg-black opacity-20 z-40"
          onClick={() => dispatch(toggleAddChat())}
        ></div>
      )}
      {addChat && (
        <div className="w-[500px] h-[400px] absolute top-1/2 left-1/2 z-50 bg-white rounded-md -translate-x-1/2 -translate-y-1/2">
          <NewChat />
        </div>
      )}
      {addContact && (
        <div
          className="w-screen h-screen absolute bg-black opacity-20"
          onClick={() => dispatch(toggleAddContact())}
        ></div>
      )}
      {addContact && <NewContact />}
    </>
  );
};

export default HiddenMenus;
