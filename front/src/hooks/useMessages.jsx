import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import useUser from './userUser';
import { useDispatch } from 'react-redux';

const useMessages = () => {
  const dispatch = useDispatch();
  const user = useUser();
  const [msg, setMessage] = useState();

  useEffect(() => {
    let socket;

    if (user?.isLogged) {
      // Connect to the socket server
      socket = io('http://localhost:8000', {
        query: {
          userId: user.user.id,
        },
      });
      socket.on('msg', (data) => {
        setMessage(data);
      });
    }

    // Cleanup the socket connection when the component unmounts
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [dispatch, user?.isLogged, user?.user?.id]);

  // Return the 'msg' state
  return msg;
};

export default useMessages;
