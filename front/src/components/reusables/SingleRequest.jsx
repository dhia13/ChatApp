import React from 'react';
import { LiaBanSolid } from 'react-icons/lia';
import { useDispatch } from 'react-redux';
import { fetchRequests } from '../../store/Slices/contactsSlice';
import api from '../../api/axiosInstance';
import InitialsAvatar from 'react-initials-avatar';

const SingeInvites = ({ request }) => {
  const dispatch = useDispatch();
  const handleCancelRequest = async (id) => {
    try {
      await api.delete(`/cancelRequest/${id}`, {
        withCredentials: true,
      });
    } catch (error) {
      throw Error('Failed to cancel request');
    }
    dispatch(fetchRequests());
  };
  return (
    <div
      className="w-full h-[80px] flex justify-between items-center py-2"
      key={request.id}
    >
      <div className="flex justify-center items-center h-full">
        {request.receiver.img ? (
          <img
            src={request.receiver.img}
            alt="profile"
            className="w-[40px] h-[40px] rounded-full mx-2 border border-blue-300 object-cover"
          />
        ) : (
          <InitialsAvatar
            name={request.receiver.name}
            className="w-[40px] h-[40px] bg-blue-300 rounded-full flex-center"
          />
        )}
        <div className="flex justify-start items-start flex-col">
          <p className="text-xs font-light">you sent request to</p>
          <p className="text-sm">{request.receiver.username}</p>
        </div>
      </div>
      <div className="flex justify-center items-center h-full gap-2 mr-2">
        <div className={`flex justify-center items-center w-full`}>
          <div
            onClick={() => handleCancelRequest(request.id)}
            className="w-[40px] h-[40px] rounded-full text-2xl hover:bg-red-400 hover:text-white hover:border-red-400 shadow-md hover:shadow-lg border border-blue-200 cursor-pointer justify-center items-center flex"
          >
            <LiaBanSolid />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingeInvites;
