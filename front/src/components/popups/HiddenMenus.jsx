import { useDispatch, useSelector } from 'react-redux';
import {
  toggleAddChat,
  toggleAddContact,
  toggleInvites,
  toggleNotifications,
  toggleUserMenu,
} from '../../store/Slices/uiSlice';
import NewContact from './NewContact';
import OutGoingCall from '../Calls/OutGoingCall';
import IncomingCall from '../Calls/IncomingCall';

const HiddenMenus = () => {
  const dispatch = useDispatch();
  const { addChat, addContact, userMenu, notifications, invites } = useSelector(
    (state) => state.ui
  );
  const incomingCall = useSelector(
    (state) => state.calls.incomingCall.incomingCall
  );
  const outGoingCall = useSelector(
    (state) => state.calls.outGoingCall.outGoingCall
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
      {outGoingCall && <OutGoingCall />}
      {incomingCall && <IncomingCall />}
    </>
  );
};

export default HiddenMenus;
