import { useDispatch, useSelector } from 'react-redux';
import {
  toggleAddChat,
  toggleAddContact,
  toggleInvites,
  toggleNotifications,
  toggleUserMenu,
} from '../../store/Slices/uiSlice';
import OutGoingCall from '../Calls/OutGoingCall';
import IncomingCall from '../Calls/IncomingCall';
import NewContact from './NewContact';

const HiddenMenus = () => {
  const dispatch = useDispatch();
  const { addChat, addContact, userMenu, notifications, invites } = useSelector(
    (state) => state.ui
  );
  const callType = useSelector((state) => state.calls.callType);
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
      {callType === 'outGoing' && <OutGoingCall />}
      {callType === 'incoming' && <IncomingCall />}
      {addContact && <NewContact />}
    </>
  );
};

export default HiddenMenus;
