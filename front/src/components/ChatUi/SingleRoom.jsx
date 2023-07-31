import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRoom } from '../../store/Slices/roomsSlice';

const SingleRoom = ({ room }) => {
  const dispatch = useDispatch();
  const onlineUsers = useSelector((state) => state.contacts.onlineUsers);

  return (
    <div
      className="h-[60px] w-full flex justify-between items-center  cursor-pointer relative"
      onClick={() => dispatch(setRoom(room._id))}
    >
      <div className="flex justify-start items-center gap-2 w-4/6">
        <div
          className={`w-[40px] h-[40px] rounded-full overflow-hidden border border-blue-200 relative hover:shadow-lg 
                        shadow-md ml-2
                      `}
        >
          <img
            alt="profile"
            className="w-full h-full"
            src={room.users[0].img}
          />
        </div>
        <div className="flex justify-center items-start flex-col">
          <h3 className="font-semibold text-base">{room.users[0].username}</h3>
          <p className="font-thin">{room?.messages[0]?.content}</p>
        </div>
      </div>
      <>
        {onlineUsers.includes(room.users[0]._id) && (
          <div className="w-[10px] h-[10px] rounded-full mx-6 bg-green-600"></div>
        )}
      </>
    </div>
  );
};

export default SingleRoom;
