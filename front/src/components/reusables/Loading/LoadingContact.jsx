import React from 'react';

const LoadingContact = () => {
  return (
    <div className="h-[70px] w-[96%] py-4 mx-4 flex justify-start gap-[12px] items-center cursor-pointer relative">
      <div className="flex justify-start items-start">
        <div className="w-[56px] h-[56px] rounded-full bg-gray-300 ml-2"></div>
      </div>
      <div className="flex justify-start items-start flex-col gap-2">
        <div className="w-[60px] h-[16px] bg-gray-300"></div>
        <div className="w-[90px] h-[12px] bg-gray-300"></div>
      </div>
    </div>
  );
};

export default LoadingContact;
