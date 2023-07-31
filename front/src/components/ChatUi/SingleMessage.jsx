import React from 'react';
import { format } from 'timeago.js';
const SingleMessage = ({ message, isMine, userImg }) => {
  const { updatedAt, content } = message;
  return (
    <>
      {isMine ? (
        <div className="w-full  flex justify-end items-start gap-4 p-2 my-2">
          <div className="max-w-2/3 bg-white px-2 pb-1 rounded-md border border-gray-200 shadow-sm flex justify-end flex-col items-end text-end">
            <p>{content}</p>
            <p className="text-xs font-thin">{format(updatedAt)}</p>
          </div>
          <div className="w-[40px]">
            <img
              src={userImg}
              alt="profileImg"
              className="w-[40px] h-[40px] rounded-full border border-white"
            />
          </div>
        </div>
      ) : (
        <div className="w-full flex justify-start items-start gap-4 p-2 my-2">
          <div className="w-[40px]">
            <img
              src={userImg}
              alt="profileImg"
              className="w-[40px] h-[40px] rounded-full border border-white"
            />
          </div>
          <div className="border border-gray-200 max-w-2/3 bg-white px-2 pb-1 rounded-md shadow-sm">
            <p>{content}</p>
            <p className="text-xs font-thin">{format(updatedAt)}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default SingleMessage;
