import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SingleMessage from '../reusables/SingleMessage';
import styled from 'styled-components';
import api from '../../api/axiosInstance';
import {
  cleanSeenMessages,
  fetchRecentRooms,
  fetchRecentRoomsWitoutLoading,
} from '../../store/Slices/roomsSlice';
import { LiaPaperPlaneSolid } from 'react-icons/lia';
import chatBg from '../../assets/images/chatBg2.jpg';
import MessagingInput from '../reusables/MessagingInput';
import { useSocket } from '../../HOC/SocketContext';
import AudioMessage from '../reusables/AudioMessage';
import IconContainer from '../reusables/IconContainer';
import { GrEmoji } from 'react-icons/gr';

const ChatBox = () => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const scrollRef = useRef();
  const { currentRoomId, rooms, newMsg, messagesToSeen } = useSelector(
    (state) => state.rooms
  );
  const [secondUser, setSecondUser] = useState();
  const [messages, setMessages] = useState([]);
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [reMessages, setReMessages] = useState([]);
  const [lastMsg, setLastMsg] = useState({});
  // filter msg to get other user messages that are not seen yet
  useEffect(() => {
    let othermsgs = [];
    messages.forEach((m) => {
      if (m.owner !== user.id && !m.seen) {
        othermsgs.push(m._id);
      }
      setLastMsg(othermsgs[-1]);
      setReMessages(othermsgs);
    });
  }, [messages, user.id]);
  // set messages to seen depending on what socket sends
  useEffect(() => {
    // Make a copy of messages
    if (messagesToSeen.length > 0) {
      const newMessages = [...messages];

      // Loop through the copy and set m.seen to true if the conditions are met
      newMessages.forEach((m) => {
        if (m.owner === user.id && !m.seen && messagesToSeen.includes(m._id)) {
          m.seen = true;
        }
      });
      // Set messages to the new copy of messages to update the state
      setMessages(newMessages);
      dispatch(cleanSeenMessages());
    }
  }, [dispatch, messages, messagesToSeen, user.id]);
  // loop through messages and get last seen msg
  useEffect(() => {
    let lm;
    messages.forEach((m) => {
      if (m.owner === user.id && m.seen) {
        lm = m._id;
      }
    });
    setLastMsg(lm);
  }, [messages, user.id]);
  // check if user is on window
  const [isOnWindow, setIsOnWindow] = useState(true);
  const handleVisibilityChange = () => {
    setIsOnWindow(!document.hidden);
  };
  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  ////
  // set msg as seen
  useEffect(() => {
    if (currentRoomId !== '' && reMessages.length > 0 && isOnWindow) {
      const setSaw = async () => {
        await api
          .put(
            '/sawMessages',
            {
              messages: reMessages,
              receiver: secondUser?._id,
              roomId: currentRoomId,
            },
            { withCredentials: true }
          )
          .then((res) => {
            dispatch(fetchRecentRoomsWitoutLoading());
          });
      };
      setSaw();
    }
  }, [currentRoomId, dispatch, isOnWindow, reMessages, secondUser?._id]);
  // get initial messages
  useEffect(() => {
    const getMessages = async () => {
      try {
        setLoading(true);
        setLoaded(false);
        await api
          .put(
            '/getMessages',
            { roomId: currentRoomId },
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            setSecondUser(res.data.target);
            setMessages(res.data.messages);
            setLoading(false);
          });
      } catch (error) {}
    };
    if (currentRoomId) {
      getMessages();
    }
  }, [currentRoomId]);
  // sending a message
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      // Event listener for 'messageReceived' event (from the server)
      socket.on('msgReceived', (newMessage) => {
        setMessages([...messages, newMessage]);
        if (rooms.length > 0) {
          dispatch(fetchRecentRoomsWitoutLoading(user.id));
        } else {
          dispatch(fetchRecentRooms(user.id));
        }
      });

      // Clean up event listeners on unmount
      return () => {
        socket.off('msg');
        socket.off('messageReceived');
      };
    }
  }, [dispatch, messages, rooms.length, socket, user.id]);
  const handleSendMessage = (e) => {
    e.preventDefault();
    setMessage('');
    socket.emit('sendMsg', {
      message: { owner: user.id, content: message, room: currentRoomId },
      receiver: secondUser._id,
    });
  };
  ///
  useEffect(() => {
    if (newMsg && currentRoomId === newMsg.room) {
      setMessages((prevMessages) => [...prevMessages, newMsg]);
    }
    if (rooms.length > 0) {
      dispatch(fetchRecentRoomsWitoutLoading());
    } else {
      dispatch(fetchRecentRooms());
    }
  }, [currentRoomId, dispatch, newMsg, rooms.length]);

  useEffect(() => {
    if (!loading && !loaded) {
      scrollRef.current?.scrollIntoView({ behavior: 'instant' });
      setLoaded(true);
    } else {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loaded, loading]);
  return (
    <>
      {currentRoomId === '' ? (
        <div className="w-full h-full flex justify-center items-center bg-gray-200 text-2xl font-semibold">
          Select a chat or start a new conversation
        </div>
      ) : (
        <>
          {loading ? (
            <>
              <div className="w-full h-[80px] flex justify-center font-bold items-center  bg-cyan-700">
                <div className="h-[40px] w-[120px] bg-gray-300 animate-pulse rounded-md"></div>
              </div>
              <div className="flex-center flex-col relative">
                <div className="absolute top-0 left-0 bg-gray-200 w-full h-full ">
                  <img
                    src={chatBg}
                    alt="bg"
                    className="w-full h-full object-cover"
                  />
                </div>
                <ChatBoxContainer className="w-full h-[calc(100vh-160px)] justify-start items-center flex flex-col gap-2 overflow-y-auto z-30"></ChatBoxContainer>
                <form
                  className="w-full h-[80px] flex justify-center items-center relative"
                  onSubmit={(e) => handleSendMessage(e)}
                >
                  <div className="w-[80%] h-[60px] mb-[20px] bg-gray-300 items-center rounded-md flex justify-around">
                    <div className="">
                      <IconContainer>
                        <GrEmoji />
                      </IconContainer>
                    </div>

                    <input
                      className="w-[80%] h-[60px] bg-gray-300 border-none outline-none rounded-md text-black placeholder:text-gray-800"
                      value={message}
                      type="text"
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Send a message"
                    />
                    {message === '' ? (
                      <LiaPaperPlaneSolid
                        className={` text-2xl cursor-pointer hover:text-blue-700 ${
                          message !== '' && 'text-blue-900'
                        }`}
                        onClick={(e) => handleSendMessage(e)}
                      />
                    ) : (
                      <LiaPaperPlaneSolid
                        className={`text-2xl cursor-pointer hover:text-blue-700 ${
                          message !== '' && 'text-blue-900'
                        }`}
                        onClick={(e) => handleSendMessage(e)}
                      />
                    )}
                    <AudioMessage />
                  </div>
                </form>
              </div>
            </>
          ) : (
            <>
              <div className="w-full h-[80px] flex justify-center font-bold items-center bg-cyan-700">
                {secondUser?.username.charAt(0).toUpperCase() +
                  secondUser?.username.slice(1)}
              </div>
              <div className="flex-center flex-col relative">
                <div className="absolute top-0 left-0 bg-gray-200 w-full h-full ">
                  <img
                    src={chatBg}
                    alt="bg"
                    className="w-full h-full object-cover"
                  />
                </div>
                <ChatBoxContainer className="w-full h-[calc(100vh-160px)] justify-start items-center flex flex-col gap-2 overflow-y-auto z-30">
                  {messages.length > 0 &&
                    messages.map((m) => (
                      <div ref={scrollRef} className="w-full" key={m._id}>
                        <SingleMessage
                          message={m}
                          isMine={m.owner === user.id}
                          user={m?.owner === user.id ? user : secondUser}
                          lastSeen={lastMsg}
                          otherUser={m.owner === user.id ? secondUser : null}
                        />
                      </div>
                    ))}
                </ChatBoxContainer>
                <MessagingInput
                  message={message}
                  setMessage={setMessage}
                  handleSendMessage={handleSendMessage}
                />
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default ChatBox;
const ChatBoxContainer = styled.div`
  /* Set a fixed height and width for the container to enable scrolling */
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  /* Hide the default scrollbar */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */

  /* For WebKit based browsers (Chrome, Safari, Opera) */
  &::-webkit-scrollbar {
    width: 8px;
  }

  /* For WebKit based browsers (Chrome, Safari, Opera) */
  &::-webkit-scrollbar-thumb {
    background-color: rgb(147 197 253);
    border-radius: 4px;
  }

  /* For WebKit based browsers (Chrome, Safari, Opera) */
  &::-webkit-scrollbar-thumb:hover {
    background-color: #3f65d4;
  }

  /* For WebKit based browsers (Chrome, Safari, Opera) */
  &::-webkit-scrollbar-thumb:active {
    background-color: #466cdf;
  }

  /* For WebKit based browsers (Chrome, Safari, Opera) */
  &::-webkit-scrollbar-track {
    background-color: #f1f1f1;
    border-radius: 8px;
  }

  /* For WebKit based browsers (Chrome, Safari, Opera) */
  &::-webkit-scrollbar-track:hover {
    background-color: #e0e0e0;
  }
`;
