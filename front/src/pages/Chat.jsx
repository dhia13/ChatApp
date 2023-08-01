import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopSideNav from '../components/ChatUi/TopSideNav';
import ChatBox from '../components/ChatUi/ChatBox';
import RecentRooms from '../components/ChatUi/RecentRooms';
import ContactsOrRooms from '../components/UI/ContactsOrRooms';
import Contacts from '../components/ChatUi/Contacts';
import useUser from '../hooks/userUser';
import { useSelector } from 'react-redux';
import useSocket from '../hooks/useSocket';
import HiddenMenus from '../components/popups/HiddenMenus';
import Loading from '../components/reusables/Loading/Loading';
import { ToastContainer } from 'react-toastify';

const Chat = () => {
  const navigate = useNavigate();
  const user = useUser();
  useSocket();
  useEffect(() => {
    if (user !== null && user?.isLogged === false) {
      navigate('/login');
    }
  }, [navigate, user]);
  const { isRecent } = useSelector((state) => state.ui);
  const [currentChat, setCurrentChat] = useState(null);
  if (user === null) {
    return <Loading />;
  }
  return (
    <div className="w-screen h-screen flex justify-start items-start overflow-hidden relative">
      <ToastContainer />
      <HiddenMenus />
      {/* left nav */}
      <div className="h-screen w-[400px] flex justify-start items-start border-r-2 border-blue-300 flex-col">
        <TopSideNav />
        <ContactsOrRooms />
        {/* recent chats list */}
        {!isRecent ? (
          <Contacts setCurrentChat={setCurrentChat} />
        ) : (
          <RecentRooms setCurrentChat={setCurrentChat} />
        )}
      </div>
      {/* Chat box */}
      <ChatBox currentChat={currentChat} />
    </div>
  );
};

export default Chat;
