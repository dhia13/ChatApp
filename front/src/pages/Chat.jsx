import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopSideNav from '../components/ChatUi/TopSideNav';
import ChatBox from '../components/ChatUi/ChatBox';
import RecentRooms from '../components/ChatUi/RecentRooms';
import ContactsOrRooms from '../components/UI/ContactsOrRooms';
import Contacts from '../components/ChatUi/Contacts';
import useUser from '../hooks/userUser';
import { useDispatch, useSelector } from 'react-redux';
import HiddenMenus from '../components/popups/HiddenMenus';
import Loading from '../components/reusables/Loading/Loading';
import { ToastContainer } from 'react-toastify';
import Profile from '../components/ChatUi/Profile';
import { SocketProvider } from '../HOC/SocketContext';
const Chat = () => {
  const navigate = useNavigate();
  useUser();
  const dispatch = useDispatch();
  const { isLogged } = useSelector((state) => state.user);
  useEffect(() => {
    if (isLogged) {
      setLoading(false);
    } else {
      navigate('/login');
    }
  }, [dispatch, isLogged, navigate]);
  const { isRecent, current } = useSelector((state) => state.ui);
  const [currentChat, setCurrentChat] = useState(null);
  const [loading, setLoading] = useState(true);
  if (loading) {
    return <Loading />;
  }
  return (
    <SocketProvider>
      <div className="w-screen h-screen flex justify-start items-start overflow-hidden relative bg-cyan-500">
        <ToastContainer />
        <HiddenMenus />
        {/* left nav */}
        <div className="h-screen w-[400px] flex justify-start items-start shadow-cyan-400 shadow-sm flex-col">
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
        <div
          className={`w-[calc(100%-290px)] transition-all duration-200 h-screen`}
        >
          {current === 'chat' && <ChatBox currentChat={currentChat} />}
          {current === 'profile' && <Profile />}
        </div>
      </div>
    </SocketProvider>
  );
};

export default Chat;
