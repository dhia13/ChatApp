// SocketContext.js
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import {
  fetchContactsWitouLoading,
  newInvite,
  setOnlineUsers,
} from '../store/Slices/contactsSlice';
import { toast } from 'react-toastify';
import { addNotification } from '../store/Slices/notificationsSlice';
import {
  fetchRecentRoomsWitoutLoading,
  setMessagesToSeen,
  setNewMsg,
} from '../store/Slices/roomsSlice';

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { isLogged, id } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const currentOnlineUsers = useSelector((state) => state.contacts.onlineUsers);
  const currentRoom = useSelector((state) => state.rooms.currentRoomId);
  const prevOnlineUsersRef = useRef(currentOnlineUsers);
  // socket
  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_API_URL, {
      query: {
        userId: id,
      },
    });
    // Initialize your socket connection here
    if (isLogged && id) {
      setSocket(newSocket);
      newSocket.on('newMsg', (data) => {
        dispatch(setNewMsg(data));
      });
      newSocket.on('connection');
      newSocket.on('seen', (data) => {
        if (data.roomId === currentRoom) {
          dispatch(setMessagesToSeen(data.messages));
        }
        dispatch(fetchRecentRoomsWitoutLoading());
      });
      newSocket.on('isOnline', (data) => {
        const prevOnlineUsers = prevOnlineUsersRef.current;
        if (data.online && !prevOnlineUsers.includes(data.id)) {
          dispatch(setOnlineUsers([...prevOnlineUsers, data.id]));
        } else if (!data.online && prevOnlineUsers.includes(data.id)) {
          dispatch(
            setOnlineUsers(prevOnlineUsers.filter((id) => id !== data.id))
          );
        }
      });
      newSocket.on('invite', () => {
        dispatch(newInvite());
        const notify = () =>
          toast.success('New Invitation', {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: 'light',
          });
        notify();
      });
      newSocket.on('notification', (data) => {
        if (data?.type === 'inviteAccepted') {
          dispatch(addNotification());
          const notify = () =>
            toast.success(
              `${data.from.username} accepted your friend request`,
              {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: 'light',
              }
            );
          notify();
          dispatch(fetchContactsWitouLoading());
        }
      });
      return () => {
        newSocket.disconnect();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRoom, dispatch, id, isLogged]);

  return (
    <SocketContext.Provider
      value={{
        socket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

const useSocket = () => {
  return useContext(SocketContext);
};

export { SocketProvider, useSocket };
