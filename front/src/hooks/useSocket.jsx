import { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchContactsWitouLoading,
  newInvite,
  setOnlineUsers,
} from '../store/Slices/contactsSlice';
import { addNotification } from '../store/Slices/notificationsSlice';
import { toast } from 'react-toastify';
import {
  fetchRecentRoomsWitoutLoading,
  setMessagesToSeen,
  setNewMsg,
} from '../store/Slices/roomsSlice';

const useSocket = () => {
  const { isLogged, id } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const currentOnlineUsers = useSelector((state) => state.contacts.onlineUsers);
  const currentRoom = useSelector((state) => state.rooms.currentRoomId);
  const prevOnlineUsersRef = useRef(currentOnlineUsers);
  useEffect(() => {
    let socket;
    if (isLogged) {
      socket = io(process.env.REACT_APP_API_URL, {
        query: {
          userId: id,
        },
      });
      socket.on('newMsg', (data) => {
        dispatch(setNewMsg(data));
      });
      socket.on('connection');
      socket.on('seen', (data) => {
        console.log('msg seen');
        console.log({ messagesSeen: data });
        console.log(data.roomId, currentRoom);
        if (data.roomId === currentRoom) {
          console.log('set messages to seen');
          dispatch(setMessagesToSeen(data.messages));
        }
        dispatch(fetchRecentRoomsWitoutLoading());
      });
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
  }, [currentRoom, dispatch, id, isLogged]);
};

export default useSocket;
