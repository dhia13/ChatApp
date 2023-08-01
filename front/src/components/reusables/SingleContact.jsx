import { useDispatch, useSelector } from 'react-redux';
import { setRoom } from '../../store/Slices/roomsSlice';
import api from '../../api/axiosInstance';

const SingleContact = ({ contact }) => {
  const dispatch = useDispatch();
  const onlineUsers = useSelector((state) => state.contacts.onlineUsers);
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
  return (
    <div
      key={contact.id}
      className={`h-[70px] w-[96%] py-4 flex justify-between items-center  cursor-pointer relative hover:bg-gray-200 rounded-md `}
      onClick={() => handleOpenChat(contact.id)}
    >
      <div className="flex justify-start items-center gap-1 w-full">
        <div
          className={`w-[56px] h-[56px] relative rounded-full overflow-hidden border border-blue-200  hover:shadow-lg shadow-md m-2`}
        >
          <img
            alt="profile"
            className="w-full h-full object-cover"
            src={contact.img}
          />
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
      <div className="mr-8">ss</div>
    </div>
  );
};

export default SingleContact;
