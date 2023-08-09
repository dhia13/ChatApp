import { useEffect, useState } from 'react';
import api from '../../../api/axiosInstance';
import { format } from 'timeago.js';
import styled from 'styled-components';
import InitialsAvatar from 'react-initials-avatar';

const NotificationMenu = () => {
  const [loading, setLoading] = useState(true);
  const [notificationsList, setNotificationsList] = useState([]);
  const getNotifications = async () => {
    await api
      .get('/notificationsList', {
        withCredentials: true,
      })
      .then((res) => {
        setLoading(false);
        setNotificationsList(res.data.notifications);
      });
  };
  useEffect(() => {
    getNotifications();
  }, []);
  const handleClearNotifications = async () => {
    setLoading(true);
    await api
      .get('/clearNotifications', {
        withCredentials: true,
      })
      .then((res) => {
        setNotificationsList([]);
        setLoading(false);
      });
  };
  return (
    <div
      className={`w-[260px] h-[380px] border border-blue-200  bg-white z-50 flex justify-center  items-center rounded-md absolute shadow-md top-[65px] left-[257px]
      `}
    >
      {loading ? (
        <ScrollDiv
          role="status"
          className="absolute top-0 right-0 overflow-auto w-full h-[calc(100%-40px)]"
        >
          <LoadingNoti />
          <LoadingNoti />
          <LoadingNoti />
          <LoadingNoti />
          <LoadingNoti />
          <LoadingNoti />
        </ScrollDiv>
      ) : (
        <ScrollDiv className="absolute top-0 right-0 overflow-auto w-full h-[calc(100%-40px)]">
          {notificationsList.map((notification) => (
            <div
              className="w-full h-[60px] flex border-b border-gray-200"
              key={notification.id}
            >
              <div className="w-[60px] h-[60px]  flex-center">
                <InitialsAvatar
                  name={notification.from.name}
                  className="w-[46px] h-[46px] bg-blue-300 rounded-full flex-center"
                />
              </div>
              <div className="w-[calc(100%-60px)] h-[60px]">
                <h3 className="font-semibold text-sm px-2 pt-1">
                  {notification.from.username}
                </h3>
                <p className="font-normal text-xs px-2">Is now your friend</p>
                <p className="font-light text-xs px-2">
                  {format(notification.updatedAt)}
                </p>
              </div>
            </div>
          ))}
        </ScrollDiv>
      )}
      <div
        className="w-full h-[40px] bottom-0 flex justify-center items-center absolute bg-gray-100 rounded-b-md hover:bg-gray-200 cursor-pointer"
        onClick={handleClearNotifications}
      >
        Clear all notifications
      </div>
    </div>
  );
};

export default NotificationMenu;
const LoadingNoti = () => {
  return (
    <div className="w-full h-[60px] flex">
      <div className="w-[60px] h-[60px] flex-center">
        <div className="w-[46px] h-[46px] rounded-full bg-gray-300 animate-pulse"></div>
      </div>

      <div className="w-[calc(100%-60px)] h-[60px]">
        <div className="w-12 h-4 rounded-md bg-gray-300 animate pulse mx-2 mt-1"></div>
        <div className="w-30 h-4 rounded-md bg-gray-300 animate pulse mx-2 mt-1"></div>
        <div className="w-20 h-2 rounded-md bg-gray-300 animate pulse mx-2 mt-1"></div>
      </div>
    </div>
  );
};
const ScrollDiv = styled.div`
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
