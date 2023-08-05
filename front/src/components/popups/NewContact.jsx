import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { GrAdd } from 'react-icons/gr';
import { useDispatch } from 'react-redux';
import { fetchInvites, fetchRequests } from '../../store/Slices/contactsSlice';
import { toast } from 'react-toastify';
import InitialsAvatar from 'react-initials-avatar';

const NewContact = () => {
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState('');
  const [searshList, setSearshList] = useState([]);
  const [loading, setLoading] = useState(false);
  const searsh = async (word) => {
    setLoading(true);
    await api
      .get(`/contacts?keyword=${word}`, { withCredentials: true })
      .then((res) => {
        setLoading(false);
        return setSearshList(res.data.contacts);
      })
      .catch((err) => {
        return false;
      });
  };
  useEffect(() => {
    searsh(keyword);
  }, [keyword]);
  useEffect(() => {
    dispatch(fetchRequests());
    dispatch(fetchInvites());
  }, [dispatch]);
  const handleSendRequest = async (id) => {
    try {
      setLoading(true);
      await api
        .post(
          '/request',
          { receiver: id },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          const notify = () =>
            toast.success('Request sent', {
              position: 'top-right',
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'light',
            });
          notify();
          searsh(keyword);
        });
    } catch (error) {
      const notify = () =>
        toast.error('Something went wrong', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      notify();
      throw Error('Failed to send request');
    }
  };
  return (
    <div className="w-[500px] h-[400px] absolute top-1/2 left-1/2 bg-white rounded-md -translate-x-1/2 -translate-y-1/2 flex flex-col border border-gray-400 z-50">
      <div className="w-full h-[50px] flex justify-start items-center">
        <h1 className="px-4 text-xl font-semibold">Find new friends</h1>
      </div>
      <div className="w-full h-[50px] flex justify-center items-center">
        <input
          className="w-[96%] h-[30px] bg-gray-50 rounded-md p-4 py-5 outline-none shadow-md"
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          autoComplete="off"
          placeholder="Search by Name, Username, Email"
        />
      </div>
      {loading ? (
        <div className="w-full h-[250px] justify-center items-center flex">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {searshList.length > 0 ? (
            <div className="w-full">
              {searshList.map((item) => (
                <div
                  className="flex justify-between items-center my-2 w-full"
                  key={item._id}
                >
                  <div className="flex justify-center items-center">
                    <div className="w-[40px]">
                      {item.img ? (
                        <img
                          src={item.img}
                          alt="profileImg"
                          className="w-[40px] h-[40px] rounded-full border border-white object-cover"
                        />
                      ) : (
                        <InitialsAvatar
                          name={item.name}
                          className="w-[40px] h-[40px] bg-blue-300 rounded-full flex-center"
                        />
                      )}
                    </div>
                    <div className="flex justify-center items-start flex-col">
                      <div className="font-normal">{item.username}</div>
                      <div className="font-thin">{item.name}</div>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      handleSendRequest(item._id);
                    }}
                    className="content-end border mx-4 border-gray-400 rounded-full hover:bg-blue-300 w-[40px] h-[40px] flex justify-center items-center cursor-pointer"
                  >
                    <GrAdd />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-[200px] flex justify-center items-center">
              No result
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NewContact;
