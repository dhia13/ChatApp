import { useDispatch, useSelector } from 'react-redux';
import { setRoom } from '../../store/Slices/roomsSlice';
import api from '../../api/axiosInstance';
import IconContainer from './IconContainer';
import { RiDeleteBinLine } from 'react-icons/ri';
import { fetchContacts } from '../../store/Slices/contactsSlice';
import InitialsAvatar from 'react-initials-avatar';
import { setCurrent } from '../../store/Slices/uiSlice';

const SingleContact = ({ contact }) => {
  const dispatch = useDispatch();
  const { editContacts, current } = useSelector((state) => state.ui);

  const onlineUsers = useSelector((state) => state.contacts.onlineUsers);
  const handleOpenChat = async (id) => {
    if (!editContacts) {
      if (current !== 'chat') {
        dispatch(setCurrent({ current: 'chat', second: '' }));
      }
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
    }
  };
  const handleRemoveContact = async (id) => {
    api.delete(`/contact/${id}`, { withCredentials: true }).then((res) => {
      dispatch(fetchContacts());
    });
  };
  return (
    <div
      key={contact.id}
      onClick={() => handleOpenChat(contact.id)}
      className={`h-[70px] w-[96%] py-4 flex justify-between items-center  cursor-pointer relative hover:bg-gray-200 rounded-md `}
    >
      <div className="flex justify-start items-center gap-1 w-full">
        <div
          className={`w-[56px] h-[56px] relative rounded-full overflow-hidden border border-blue-200  hover:shadow-lg shadow-md m-2`}
        >
          {contact.img ? (
            <img
              alt="profile"
              className="w-full h-full object-cover"
              src={contact.img}
            />
          ) : (
            <InitialsAvatar
              name={contact.name}
              className="w-full h-full bg-blue-300 rounded-full flex-center"
            />
          )}
        </div>
        {onlineUsers.includes(contact.id) && (
          <div className="w-[18px] h-[18px] rounded-full top-[10px] left-[48px] border-[2px] border-white  bg-green-600 absolute"></div>
        )}
        <div className="flex justify-center items-start flex-col">
          <h3 className="font-semibold text-base">
            {contact.username.charAt(0).toUpperCase() +
              contact.username.slice(1)}
          </h3>
          <div className="flex justify-start items-center gap-2">
            <p className="font-extralight text-xs">{contact.email}</p>
          </div>
        </div>
      </div>
      {editContacts && (
        <IconContainer
          className="mr-2"
          handleClick={() => handleRemoveContact(contact.id)}
        >
          <RiDeleteBinLine />
        </IconContainer>
      )}
    </div>
  );
};

export default SingleContact;
