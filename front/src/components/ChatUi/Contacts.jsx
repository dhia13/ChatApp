import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { fetchContacts } from '../../store/Slices/contactsSlice';
import { LiaTrashAltSolid } from 'react-icons/lia';
import IconContainer from '../reusables/IconContainer';
import api from '../../api/axiosInstance';
import { setRoom } from '../../store/Slices/roomsSlice';
import LoadingContact from './LoadingContact';
const Contacts = ({ setCurrentChat, contacts }) => {
  const onlineUsers = useSelector((state) => state.contacts.onlineUsers);
  const { menu, editContacts } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const { contactsList, loading, error } = useSelector(
    (state) => state.contacts
  );
  const handleOpenChat = async (id) => {
    try {
      await api
        .put(
          '/findChatRoom',
          { target: id },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          dispatch(setRoom(res.data.id));
        });
    } catch (error) {}
  };
  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);
  const handleRemoveContact = async (id) => {
    try {
      await api
        .put(
          '/removeContact',
          { contactId: id },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          dispatch(fetchContacts());
        });
    } catch (error) {
      throw Error('Failed to send request');
    }
  };
  if (loading) {
    return (
      <div
        className={`flex justify-start items-start ${
          menu ? 'h-[calc(100%-160px)]' : 'h-[calc(100%-275px)]'
        }  w-full flex-col`}
      >
        <LoadingContact />
        <LoadingContact />
        <LoadingContact />
        <LoadingContact />
        <LoadingContact />
        <LoadingContact />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex justify-center items-center ${
          menu ? 'h-[calc(100%-160px)]' : 'h-[calc(100%-275px)]'
        }  w-full flex-col`}
      >
        Error: {error}
      </div>
    );
  }

  return (
    <div
      className={`flex justify-center items-center ${
        menu ? 'h-[calc(100%-160px)]' : 'h-[calc(100%-275px)]'
      }  w-full flex-col`}
    >
      <ChatMenu className="w-full h-full overflow-y-scroll overflow-x-hidden">
        {contactsList?.length > 0 ? (
          contactsList.map((contact) => (
            <div key={contact.id}>
              <div
                onClick={() => handleOpenChat(contact.id)}
                key={contact.id}
                className="h-[60px] w-full flex justify-between items-center  cursor-pointer"
              >
                <div className="flex justify-start items-center gap-2 w-4/6">
                  <div
                    className={`w-[40px] h-[40px] rounded-full overflow-hidden border border-blue-200 relative hover:shadow-lg 
                        shadow-md ml-2
                      `}
                  >
                    <img
                      alt="profile"
                      className="w-full h-full"
                      src={contact.img}
                    />
                  </div>
                  <div className="flex justify-center items-start flex-col">
                    <h3 className="font-semibold text-base">
                      {contact.username}
                    </h3>
                    <h2 className="font-thin text-sm">{contact.email}</h2>
                  </div>
                </div>
                {editContacts ? (
                  <IconContainer
                    className={'mr-2'}
                    handleClick={() => handleRemoveContact(contact.id)}
                  >
                    <LiaTrashAltSolid />
                  </IconContainer>
                ) : (
                  <>
                    {onlineUsers.includes(contact.id) && (
                      <div className="w-[10px] h-[10px] rounded-full mx-6 bg-green-600"></div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="w-full h-full justify-center items-center flex">
            No Contacts
          </div>
        )}
      </ChatMenu>
    </div>
  );
};

export default Contacts;

const ChatMenu = styled.div`
  /* Set a fixed height and width for the container to enable scrolling */
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  /* Hide the default scrollbar */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */

  /* For WebKit based browsers (Chrome, Safari, Opera) */
  &::-webkit-scrollbar {
    width: 8px;
  }

  /* For WebKit based browsers (Chrome, Safari, Opera) */
  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 4px;
  }

  /* For WebKit based browsers (Chrome, Safari, Opera) */
  &::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }

  /* For WebKit based browsers (Chrome, Safari, Opera) */
  &::-webkit-scrollbar-thumb:active {
    background-color: #333;
  }

  /* For WebKit based browsers (Chrome, Safari, Opera) */
  &::-webkit-scrollbar-track {
    background-color: #f1f1f1;
    border-radius: 8px;
  }

  /* For WebKit based browsers (Chrome, Safari, Opera) */
  &::-webkit-scrollbar-track:hover {
    background-color: #e0e0e0;
  }
`;
