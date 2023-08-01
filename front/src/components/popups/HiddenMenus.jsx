import { useDispatch, useSelector } from 'react-redux';
import {
  toggleAddChat,
  toggleAddContact,
  toggleInvites,
  toggleNotifications,
  toggleUserMenu,
} from '../../store/Slices/uiSlice';
import NewContact from './NewContact';

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
      {addContact && (
        <div
          className="w-screen h-screen absolute bg-black opacity-20 z-40"
          onClick={() => dispatch(toggleAddContact())}
        ></div>
      )}
      {addContact && <NewContact />}
    </>
  );
};

export default HiddenMenus;
