import React from 'react';
import {
  LiaEditSolid,
  LiaSave,
  LiaPlusSolid,
  LiaCommentsSolid,
} from 'react-icons/lia';
import { useDispatch, useSelector } from 'react-redux';
import {
  toggleAddChat,
  toggleAddContact,
  toggleEditContacts,
} from '../../store/Slices/uiSlice';
import IconContainer from '../reusables/IconContainer';

const AddNew = () => {
  const dispatch = useDispatch();
  const { isRecent, menu, editContacts } = useSelector((state) => state.ui);
  if (isRecent) {
    return (
      <div className={`h-[60px] w-full flex justify-center items-center `}>
        {menu ? (
          <div className="flex justify-center items-center w-full">
            <div
              className="flex w-2/3 gap-2 justify-center items-center hover:text-green-400 border border-blue-200 cursor-pointer p-2 rounded-2xl shadow-md hover:shadow-lg"
              onClick={() => {
                menu && dispatch(toggleAddChat());
              }}
            >
              <h3 className="text-lg">New Chat</h3>
              <LiaCommentsSolid className="text-2xl" />
            </div>
          </div>
        ) : (
          <IconContainer handleClick={() => dispatch(toggleAddChat())}>
            <LiaCommentsSolid />
          </IconContainer>
        )}
      </div>
    );
  } else {
    return (
      <div className={`h-[60px] w-full flex justify-center items-center `}>
        {menu ? (
          <div className="flex justify-center items-center w-full">
            <div className="w-5/6">
              <div
                className="flex w-[175px] ml-2 justify-center items-center gap-2 hover:text-green-400 border border-blue-200 cursor-pointer py-2 rounded-2xl shadow-md hover:shadow-lg"
                onClick={() => {
                  menu && dispatch(toggleAddContact());
                }}
              >
                <h3 className="text-lg">Add new contact</h3>
                <LiaPlusSolid className="text-2xl" />
              </div>
            </div>
            <IconContainer
              handleClick={() => dispatch(toggleEditContacts())}
              className={'w-1/6'}
            >
              {editContacts ? <LiaSave /> : <LiaEditSolid />}
            </IconContainer>
          </div>
        ) : (
          <IconContainer handleClick={() => dispatch(toggleAddContact())}>
            <LiaPlusSolid />
          </IconContainer>
        )}
      </div>
    );
  }
};

export default AddNew;
