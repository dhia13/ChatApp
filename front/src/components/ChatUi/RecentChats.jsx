import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import SingleRoom from './SingleRoom';
import { fetchRecentRooms } from '../../store/Slices/roomsSlice';
import LoadingContact from './LoadingContact';
const RecentChats = () => {
  const dispatch = useDispatch();
  const menu = useSelector((state) => state.ui.menu);
  const { rooms, loading } = useSelector((state) => state.rooms);
  console.log(rooms);
  useEffect(() => {
    dispatch(fetchRecentRooms());
  }, [dispatch]);
  if (loading) {
    return (
      <div
        className={`flex justify-start items-start ${
          menu ? 'h-[calc(100%-160px)]' : 'h-[calc(100%-275px)]'
        }  w-full flex-col`}
      >
        <LoadingContact />
        <LoadingContact />
        <LoadingContact />
        <LoadingContact />
        <LoadingContact />
        <LoadingContact />
      </div>
    );
  }
  return (
    <div
      className={`flex justify-center items-center ${
        menu ? 'h-[calc(100%-160px)]' : 'h-[calc(100%-275px)]'
      }  w-full flex-col`}
    >
      <ChatMenu className="w-full h-full overflow-y-scroll overflow-x-hidden">
        <div className="w-full h-full justify-start items-center flex flex-col">
          {rooms.length > 0 ? (
            rooms.map((r) => <SingleRoom room={r} />)
          ) : (
            <p>No Recent Conversations</p>
          )}
        </div>
      </ChatMenu>
    </div>
  );
};

export default RecentChats;

const ChatMenu = styled.div`
  /* Set a fixed height and width for the container to enable scrolling */
  height: 100%;
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
