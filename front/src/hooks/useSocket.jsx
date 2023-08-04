import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchContactsWitouLoading,
  newInvite,
  setOnlineUsers,
} from '../store/Slices/contactsSlice';
import { addNotification } from '../store/Slices/notificationsSlice';
import { toast } from 'react-toastify';

const useSocket = () => {
  const { isLogged, id } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [msg, setMessage] = useState();
  const currentOnlineUsers = useSelector((state) => state.contacts.onlineUsers);

  const prevOnlineUsersRef = useRef(currentOnlineUsers);
  useEffect(() => {
    let socket;
    let url = 'http://localhost:8000';
    if (process.env.NODE_ENV === 'production') {
      console.log('production');
      url = 'https://chat-odn3.onrender.com';
    }
    if (isLogged) {
      // Connect to the socket server
      socket = io(url, {
        query: {
          userId: id,
        },
      });
      socket.on('msg', (data) => {
        setMessage(data);
      });
      socket.on('connection');
      socket.on('isOnline', (data) => {
        const prevOnlineUsers = prevOnlineUsersRef.current;
        if (data.online && !prevOnlineUsers.includes(data.id)) {
          dispatch(setOnlineUsers([...prevOnlineUsers, data.id]));
        } else if (!data.online && prevOnlineUsers.includes(data.id)) {
          dispatch(
            setOnlineUsers(prevOnlineUsers.filter((id) => id !== data.id))
          );
        }
      });
      socket.on('invite', () => {
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
      socket.on('notification', (data) => {
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
    }

    // Cleanup the socket connection when the component unmounts
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [dispatch, id, isLogged]);

  // Return the 'msg' state
  return msg;
};

export default useSocket;
