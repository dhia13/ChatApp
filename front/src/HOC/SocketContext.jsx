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
import {
  callAccepted,
  initCall,
  isRinging,
  setReceive,
  terminateCall,
} from '../store/Slices/callsSlice';
import Peer from 'simple-peer';

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const { isLogged, id } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const currentOnlineUsers = useSelector((state) => state.contacts.onlineUsers);
  const currentRoom = useSelector((state) => state.rooms.currentRoomId);
  const prevOnlineUsersRef = useRef(currentOnlineUsers);

  const [socket, setSocket] = useState(null);
  useEffect(() => {
    if (id) {
      setSocket(
        io(process.env.REACT_APP_API_URL, {
          query: {
            userId: id,
          },
        })
      );
    }
    return () => {
      socket.disconnect();
    };
  }, [id]);
  useEffect(() => {
    if (isLogged && id && socket) {
      socket.on('newMsg', (data) => {
        dispatch(setNewMsg(data));
      });
      socket.on('connection');
      socket.on('seen', (data) => {
        if (data.roomId === currentRoom) {
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
      socket.on('ringUser', (data) => {
        dispatch(setReceive(data));
        socket.emit('ringing', data.from.id);
        console.log(data);
      });
      socket.on('isRinging', (data) => {
        dispatch(isRinging());
      });
      socket.on('end-call', () => {
        dispatch(terminateCall());
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => {
            track.stop();
          });
          setStream(null);
        }
        // connectionRef.current.destroy();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRoom, dispatch, id, isLogged]);
  // calls
  const [stream, setStream] = useState();
  const myVideoRef = useRef(null);
  const otherVideoRef = useRef(null);
  const connectionRef = useRef(null);
  const { useMedia, from, type, signal, to } = useSelector(
    (state) => state.calls
  );
  const myInfo = useSelector((state) => state.user);
  // get Media
  useEffect(() => {
    if (useMedia) {
      let config;
      if (type === 'audio') {
        config = { video: false, audio: true };
      } else {
        config = { video: true, audio: true };
      }
      navigator.mediaDevices
        .getUserMedia(config)
        .then((currentStream) => {
          setStream(currentStream);
          myVideoRef.current.srcObject = currentStream;
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [useMedia, type]);
  const callUser = (user, type) => {
    dispatch(initCall({ to: user, type }));
    console.log('calling', user.id);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on('signal', (data) => {
      socket.emit('callUser', {
        to: user,
        signal: data,
        from: myInfo,
      });
    });
    peer.on('stream', (stream) => {
      otherVideoRef.current.srcObject = stream;
    });
    socket.on('callAccepted', (signal) => {
      console.log(signal);
      dispatch(callAccepted());
      peer.signal(signal);
    });
    connectionRef.current = peer;
  };
  const answerCall = () => {
    dispatch(callAccepted());
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: from });
    });
    peer.on('stream', (stream) => {
      otherVideoRef.current.srcObject = stream;
    });
    peer.signal(signal);
    connectionRef.current = peer;
  };
  const endCall = () => {
    console.log('ending call');
    dispatch(terminateCall());
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
      setStream(null);
    }
    if (type === 'incoming') {
      socket.emit('endCall', { id: from.id });
    } else {
      socket.emit('endCall', { id: to.id });
    }
    // connectionRef.current.destroy();
  };
  return (
    <SocketContext.Provider
      value={{
        socket,
        callUser,
        answerCall,
        endCall,
        myVideoRef,
        otherVideoRef,
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
