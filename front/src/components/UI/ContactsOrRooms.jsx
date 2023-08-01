import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleAddContact, toggleIsRecent } from '../../store/Slices/uiSlice';
import IconContainer from '../reusables/IconContainer';
import { IoMdAdd } from 'react-icons/io';
const ContactsOrRooms = () => {
  const { isRecent } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  return (
    <div className="w-full h-[30px] flex justify-between my-4 items-center">
      <div className="flex justify-center items-center ml-4">
        <div
          onClick={() => dispatch(toggleIsRecent(true))}
          className={`flex justify-center items-center  ${
            isRecent && 'bg-blue-200 text-blue-600'
          } border-blue-100 h-full px-4  font-semibold rounded-3xl mr-4 hover:bg-blue-300  cursor-pointer hover:shadow-lg`}
        >
          chats
        </div>
        <div
          onClick={() => dispatch(toggleIsRecent(false))}
          className={`flex justify-center items-center  ${
            !isRecent && 'bg-blue-200 text-blue-600'
          } border-blue-100 font-semibold h-full  px-4 py-[1px] rounded-3xl mr-4 hover:bg-blue-300  cursor-pointer hover:shadow-lg`}
        >
          people
        </div>
      </div>
      {!isRecent && (
        <IconContainer
          handleClick={() => dispatch(toggleAddContact())}
          className="mr-2"
        >
          <IoMdAdd />
        </IconContainer>
      )}
    </div>
  );
};

export default ContactsOrRooms;
