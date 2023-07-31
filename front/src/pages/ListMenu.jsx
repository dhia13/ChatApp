import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleIsRecent } from '../store/Slices/uiSlice';
import { LiaCommentsSolid, LiaUsersSolid } from 'react-icons/lia';

const ListMenu = () => {
  const { isRecent, menu } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  return (
    <div className="w-full h-[40px] flex justify-center items-center border-b border-t border-blue-100 shadow-sm">
      <div
        onClick={() => dispatch(toggleIsRecent(true))}
        className={`flex justify-center items-center w-1/2 border-r ${
          isRecent && 'bg-blue-200'
        } border-blue-100 h-full hover:bg-blue-300  cursor-pointer hover:shadow-lg`}
      >
        {menu ? 'Chats' : <LiaCommentsSolid className="w-[24px]" />}
      </div>
      <div
        onClick={() => dispatch(toggleIsRecent(false))}
        className={`flex justify-center items-center w-1/2 h-full hover:bg-blue-300 cursor-pointer hover:shadow-lg ${
          !isRecent && 'bg-blue-200'
        }`}
      >
        {menu ? 'People' : <LiaUsersSolid className="w-[24px]" />}
      </div>
    </div>
  );
};

export default ListMenu;
