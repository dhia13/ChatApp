import { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import useUser from './userUser';
import { useDispatch, useSelector } from 'react-redux';
import { setOnlineUsers } from '../store/Slices/contactsSlice';
import { addNotification } from '../store/Slices/notificationsSlice';

const useSocket = () => {
  const currentOnlineUsers = useSelector((state) => state.contacts.onlineUsers);
  const dispatch = useDispatch();
  const user = useUser();
  const prevOnlineUsersRef = useRef(currentOnlineUsers); // Ref to store the previous onlineUsers value
  useEffect(() => {
    let socket;

    if (user?.isLogged) {
      // Connect to the socket server
      socket = io('http://localhost:8000', {
        query: {
          userId: user.user.id,
        },
      });

      // Listen for the 'connect' event
      socket.on('connection', () => {
        // Send the user ID as the socket connection ID
      });
      socket.on('isOnline', (data) => {
        console.log(data);
        // Handle the online status update received from the server
        const prevOnlineUsers = prevOnlineUsersRef.current;

        if (data.online && !prevOnlineUsers.includes(data.id)) {
          dispatch(setOnlineUsers([...prevOnlineUsers, data.id]));
        } else if (!data.online && prevOnlineUsers.includes(data.id)) {
          dispatch(
            setOnlineUsers(prevOnlineUsers.filter((id) => id !== data.id))
          );
        }
      });
      socket.on('notification', (data) => {
        dispatch(addNotification(data.newNotification));
      });
      // Clean up on component unmount
      // Add 'beforeunload' event listener for cleanup
      const handleBeforeUnload = () => {
        socket.disconnect();
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      // Clean up on component unmount
      return () => {
        // Remove the 'beforeunload' event listener
        window.removeEventListener('beforeunload', handleBeforeUnload);

        // Perform cleanup tasks
        socket.disconnect();
      };
    }
  }, [dispatch, user?.isLogged, user?.user?.id]);

  // Update the previous onlineUsers value when it changes
  useEffect(() => {
    prevOnlineUsersRef.current = currentOnlineUsers;
  }, [currentOnlineUsers]);
};

export default useSocket;
