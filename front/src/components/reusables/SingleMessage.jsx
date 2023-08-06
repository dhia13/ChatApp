import React from 'react';
import { format } from 'timeago.js';
import InitialsAvatar from 'react-initials-avatar';
import { BsCheck2, BsCheck2All } from 'react-icons/bs';

const SingleMessage = ({ message, isMine, user, lastSeen, otherUser }) => {
  const { img, name } = user;
  const { updatedAt, content, _id, seen } = message;
  return (
    <>
      {isMine ? (
        <div className="w-full  flex justify-end items-start gap-4 p-2 my-2">
          <div className="mt-1 max-w-2/3 pb-1 rounded-md bg-gray-50 shadow-md p-2 flex justify-center items-start flex-col gap-1">
            <p>{content}</p>
            <div className="flex justify-center items-center gap-2">
              {lastSeen === _id ? (
                <div className="w-[20px]">
                  <BsCheck2All className="text-green-500" />
                </div>
              ) : message.seen && lastSeen !== _id ? (
                <div className="w-[20px]">
                  <BsCheck2All className="text-blue-500" />
                </div>
              ) : (
                <div className="w-[20px]">
                  <BsCheck2 className="text-gray-500" />
                </div>
              )}
              <p
                className={`text-xs font-thin ${
                  seen ? 'text-green-600' : 'text-gray-500'
                }`}
              >
                {format(updatedAt)}
              </p>
            </div>
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
            <div className="flex justify-center items-center gap-2">
              {lastSeen === _id ? (
                <div className="w-[20px]">
                  <BsCheck2All className="text-green-500" />
                </div>
              ) : message.seen && lastSeen !== _id ? (
                <div className="w-[20px]">
                  <BsCheck2All className="text-blue-500" />
                </div>
              ) : (
                <div className="w-[20px]">
                  <BsCheck2 className="text-gray-500" />
                </div>
              )}
              <p className="text-xs font-thin">{format(updatedAt)}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SingleMessage;
