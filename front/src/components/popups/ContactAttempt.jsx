import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchInvites, fetchRequests } from '../../store/Slices/contactsSlice';
import Invites from '../reusables/Invites';
import Requests from '../reusables/Requests';

const ContactAttempt = () => {
  const dispatch = useDispatch();
  const [isInvites, setIsInvites] = useState(true);
  useEffect(() => {
    if (isInvites) {
      dispatch(fetchInvites());
    } else {
      dispatch(fetchRequests());
    }
  }, [dispatch, isInvites]);
  return (
    <div
      className={`w-[300px] h-[300px] border border-blue-200 bg-white z-50 flex flex-col 
      justify-start items-start rounded-md absolute shadow-md top-[65px] left-[195px]`}
    >
      <div className="w-full h-[40px] flex justify-center items-center border-b border-gray-400 ">
        <div
          className={`flex justify-center items-center w-1/2 hover:bg-blue-200 h-full rounded-tl-md cursor-pointer ${
            isInvites && 'bg-blue-300'
          }`}
          onClick={() => setIsInvites(true)}
        >
          <p className="text-xs">invitations</p>
        </div>
        <div
          className={`flex justify-center items-center w-1/2 hover:bg-blue-200 h-full rounded-tr-md cursor-pointer ${
            !isInvites && 'bg-blue-300'
          }`}
          onClick={() => setIsInvites(!true)}
        >
          <p className="text-xs">requests sent</p>
        </div>
      </div>
      {isInvites ? <Invites /> : <Requests />}
    </div>
  );
};

export default ContactAttempt;
