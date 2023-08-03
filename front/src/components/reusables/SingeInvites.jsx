import React from 'react';
import { LiaBanSolid, LiaCheckSolid } from 'react-icons/lia';
import api from '../../api/axiosInstance';
import { useDispatch } from 'react-redux';
import { fetchContacts, fetchInvites } from '../../store/Slices/contactsSlice';

const SingeInvites = ({ invite }) => {
  const dispatch = useDispatch();
  const handleAcceptInvite = async (id) => {
    try {
      await api
        .put(
          '/acceptInvite',
          { requestId: id },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          dispatch(fetchInvites());
          dispatch(fetchContacts());
        });
    } catch (error) {
      throw Error('Failed to cancel request');
    }
  };
  const handleIgnoreInvite = async (id) => {
    try {
      await api
        .delete(`/ignoreRequest/${id}`, {
          withCredentials: true,
        })
        .then((res) => {
          dispatch(fetchInvites());
        });
    } catch (error) {
      throw Error('Failed to cancel request');
    }
  };
  return (
    <div
      className="w-full h-[80px] flex justify-between items-center py-2"
      key={invite.id}
    >
      <img
        src={invite.sender.img}
        alt="profile"
        className="w-[40px] h-[40px] rounded-full mx-2 border border-blue-300 object-cover"
      />
      <div className="flex justify-start items-start flex-col">
        <p className="text-sm">{invite.sender.username}</p>
        <p className="text-xs font-light">want to be your friend</p>
      </div>
      <div className="flex justify-center items-center h-full gap-2 mr-2">
        <div
          className={`flex justify-center items-center w-full`}
          onClick={() => handleAcceptInvite(invite.id)}
        >
          <div className="w-[40px] h-[40px] rounded-full text-2xl hover:text-white hover:border-green-400 hover:bg-green-500 shadow-md hover:shadow-lg border border-blue-200 cursor-pointer justify-center items-center flex">
            <LiaCheckSolid />
          </div>
        </div>
        <div
          className={`flex justify-center items-center w-full`}
          onClick={() => handleIgnoreInvite(invite.id)}
        >
          <div className="w-[40px] h-[40px] rounded-full text-2xl hover:text-white hover:border-red-400 hover:bg-red-500 shadow-md hover:shadow-lg border border-blue-200 cursor-pointer justify-center items-center flex">
            <LiaBanSolid />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingeInvites;
