import React from 'react';

const LoadingContact = () => {
  return (
    <div className="h-[48px] flex justify-between w-full items-center gap-2 animate-pulse">
      <div className="flex justify-center items-center">
        <div className="w-[40px] h-[40px] rounded-full bg-gray-300 ml-2 mt-2"></div>
        <div className="flex justify-between items-between flex-col">
          <div className="w-[60px] h-[16px] bg-gray-300 m-2"></div>
          <div className="w-[120px] h-[12px] bg-gray-300 ml-2"></div>
        </div>
      </div>
      <div className="w-[10px] h-[10px] rounded-full bg-gray-300 mr-6"></div>
    </div>
  );
};

export default LoadingContact;
