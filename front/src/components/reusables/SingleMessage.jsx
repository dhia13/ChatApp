import React from 'react';
import { format } from 'timeago.js';
import InitialsAvatar from 'react-initials-avatar';

const SingleMessage = ({ message, isMine, user }) => {
  const { img, name } = user;
  const { updatedAt, content } = message;
  return (
    <>
      {isMine ? (
        <div className="w-full  flex justify-end items-start gap-4 p-2 my-2">
          <div className="mt-1 max-w-2/3 pb-1 rounded-md bg-gray-50 shadow-md p-2">
            <p>{content}</p>
            <p className="text-xs font-thin">{format(updatedAt)}</p>
          </div>
          <div className="w-[40px]">
            {img ? (
              <img
                src={img}
                alt="profileImg"
                className="w-[40px] h-[40px] rounded-full border border-white object-cover"
              />
            ) : (
              <InitialsAvatar
                name={name}
                className="w-[40px] h-[40px] bg-blue-300 rounded-full flex-center"
              />
            )}
          </div>
        </div>
      ) : (
        <div className="w-full flex justify-start items-start gap-4 p-2 my-2">
          <div className="w-[40px]">
            {img ? (
              <img
                src={img}
                alt="profileImg"
                className="w-[40px] h-[40px] rounded-full border border-white object-cover"
              />
            ) : (
              <InitialsAvatar
                name={name}
                className="w-[40px] h-[40px] bg-blue-300 rounded-full flex-center"
              />
            )}
          </div>
          <div className="mt-1 max-w-2/3 min-w-[100px] pb-1 rounded-md bg-gray-50 shadow-sm p-2">
            <p>{content}</p>
            <p className="text-xs font-thin">{format(updatedAt)}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default SingleMessage;
