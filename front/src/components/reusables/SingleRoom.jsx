import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRoom } from '../../store/Slices/roomsSlice';
import { format } from 'timeago.js';

const SingleRoom = ({ room }) => {
  const dispatch = useDispatch();
  const onlineUsers = useSelector((state) => state.contacts.onlineUsers);
  const currentRoomId = useSelector((state) => state.rooms.currentRoomId);
  return (
    <div
      className={`h-[70px] w-[96%] py-4 mx-4 flex justify-between items-center  cursor-pointer relative rounded-md ${
        currentRoomId === room._id
          ? 'bg-blue-300 hover:bg-blue-400'
          : 'hover:bg-gray-200'
      }`}
      onClick={() => dispatch(setRoom(room._id))}
    >
      <div className="flex justify-start items-center gap-1 w-full">
        <div
          className={`w-[56px] h-[56px] relative rounded-full overflow-hidden border border-blue-200  hover:shadow-lg shadow-md m-2`}
        >
          <img
            alt="profile"
            className="w-full h-full object-cover"
            src={room.users[0].img}
          />
        </div>
        {onlineUsers.includes(room.users[0]._id) && (
          <div className="w-[18px] h-[18px] rounded-full top-[10px] left-[48px] border-[2px] border-white  bg-green-600 absolute"></div>
        )}
        <div className="flex justify-center items-start flex-col">
          <h3 className="font-semibold text-base">
            {room.users[0].username.charAt(0).toUpperCase() +
              room.users[0].username.slice(1)}
          </h3>
          <div className="flex justify-start items-center gap-2">
            <p className="font-extralight text-xs">
              {room?.messages[0]?.content}
            </p>
            <p className="font-extralight text-xs">
              {format(room?.messages[0]?.update)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleRoom;
