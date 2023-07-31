import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SingleMessage from './SingleMessage';
import styled from 'styled-components';
import api from '../../api/axiosInstance';
import useMessages from '../../hooks/useMessages';
import { fetchRecentRooms } from '../../store/Slices/roomsSlice';

const ChatBox = () => {
  const dispatch = useDispatch();
  const menu = useSelector((state) => state.ui.menu);
  const [message, setMessage] = useState('');
  const scrollRef = useRef();
  const { currentRoomId } = useSelector((state) => state.rooms);
  const [secondUser, setSecondUser] = useState();
  const [messages, setMessages] = useState([]);
  const { img, id } = useSelector((state) => state.user);
  useEffect(() => {
    const getMessages = async () => {
      try {
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
          });
      } catch (error) {}
    };
    getMessages();
  }, [currentRoomId]);
  const handleSendMessage = (e) => {
    e.preventDefault();
    setMessage('');
    const current = new Date();
    setMessages([
      ...messages,
      {
        updatedAt: current,
        owner: id,
        content: message,
        room: currentRoomId,
      },
    ]);
    api
      .post(
        '/newMessage',
        {
          message: { owner: id, content: message, room: currentRoomId },
          receiver: secondUser._id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        dispatch(fetchRecentRooms());
      });
  };
  const newMsg = useMessages();

  useEffect(() => {
    if (newMsg && currentRoomId === newMsg.room) {
      setMessages((prevMessages) => [...prevMessages, newMsg]);
    }
    dispatch(fetchRecentRooms());
  }, [currentRoomId, dispatch, newMsg]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  return (
    <div
      className={`${
        menu ? 'w-[calc(100%-290px)]' : 'w-[calc(100%-60px)]'
      } transition-all duration-200 h-screen`}
    >
      {currentRoomId === '' ? (
        <div className="w-full h-full flex justify-center items-center">
          select a contact to start chatting
        </div>
      ) : (
        <>
          <div className="w-full h-[60px] flex justify-center items-center border-b border-blue-200">
            {secondUser?.username}
          </div>
          <ChatBoxContainer className="w-full h-[calc(100vh-150px)] justify-start items-center flex flex-col gap-2 overflow-y-auto">
            {messages.length > 0 &&
              messages.map((m) => (
                <div ref={scrollRef} className="w-full">
                  <SingleMessage
                    message={m}
                    isMine={m.owner === id}
                    userImg={m.owner === id ? img : secondUser.img}
                  />
                </div>
              ))}
          </ChatBoxContainer>
          <form
            className="w-full h-[80px] border-t border-blue-200"
            onSubmit={(e) => handleSendMessage(e)}
          >
            <input
              className="w-full h-full border-none outline-none pl-2"
              value={message}
              type="text"
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Send a message"
            />
          </form>
        </>
      )}
    </div>
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
    background-color: #888;
    border-radius: 4px;
  }

  /* For WebKit based browsers (Chrome, Safari, Opera) */
  &::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }

  /* For WebKit based browsers (Chrome, Safari, Opera) */
  &::-webkit-scrollbar-thumb:active {
    background-color: #333;
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
