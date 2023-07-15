import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RiExpandLeftLine, RiExpandRightLine } from 'react-icons/ri';

const Chat = () => {
  const navigate = useNavigate();
  const [isTokenChecked, setIsTokenChecked] = useState(true); // State variable to track token check

  useEffect(() => {
    const checkToken = async () => {
      try {
        await axios.put(
          'http://localhost:8000/api/v1/checkAccess',
          {},
          {
            withCredentials: true, // Make sure to include this option to send cookies
          }
        );
        console.log('you are logged');
        setIsTokenChecked(true); // Update state variable once token check is completed
      } catch (err) {
        navigate('/login');
      }
    };
    checkToken();
  }, [navigate]);

  const [openMenu, setOpenMenu] = useState(false);
  const handleLogout = async () => {
    try {
      await axios.put(
        'http://localhost:8000/api/v1/logout',
        {},
        {
          withCredentials: true,
        }
      );
      console.log('logged out');
      localStorage.clear();
      navigate('/login');
    } catch (err) {
      console.log('logout failed');
    }
  };
  if (!isTokenChecked) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <div role="status">
          <svg
            aria-hidden="true"
            class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
    );
  }
  return (
    <div className="w-screen h-screen flex justify-start items-start bg-gray-100">
      {/* left nav */}
      <div
        className={`h-full ${
          openMenu ? 'w-[340px]' : 'w-[60px]'
        } flex justify-start items-start bg-red-100 transition-all duration-200 flex-col`}
      >
        {/* create room and recent rooms */}
        {/* user and menu toggle */}
        <div
          className={`flex justify-between items-center w-full ${
            openMenu ? 'px-4 py-2' : 'flex-col gap-2'
          } bg-red-200`}
        >
          <div className="flex justify-center items-center gap-4">
            <div className="w-[40px] h-[40px] rounded-full bg-green-600 overflow-hidden">
              <img
                src="https://scontent.falg7-1.fna.fbcdn.net/v/t39.30808-6/347824599_1002457060920123_4746083599100789479_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeFkPKUxO2M2GPQalxb4VuG6WW-qbIBkjkFZb6psgGSOQf37DxoS33wrdHcKYoc3gTXMJoN07s0g4AmUxYtmAluN&_nc_ohc=cXG8-GTffxUAX9MfZCr&_nc_ht=scontent.falg7-1.fna&oh=00_AfAP017CprMAZ6Eff8L4HOUfXmFHrDSM0HTgvwtsJnuOTQ&oe=64B7A85F"
                alt="profile"
                className="w-full h-full"
              />
            </div>
            {openMenu && <div className="font-semibold">Sahhar Dhia</div>}
          </div>
          <div
            className="w-[40px] h-[40px] rounded-full bg-green-600 justify-center items-center flex"
            onClick={() => setOpenMenu(!openMenu)}
          >
            {openMenu ? <RiExpandLeftLine /> : <RiExpandRightLine />}
          </div>
        </div>
      </div>
      {/* main */}
      <div
        className={`${
          openMenu ? 'w-[calc(100%-340px)]' : 'w-[calc(100%-60px)]'
        } transition-all duration-200 bg-yellow-200 h-screen`}
      ></div>
      {/* <p onClick={handleLogout}>logout</p> */}
      {/* <p onClick={() => setOpenMenu(!openMenu)}>menu</p> */}
      {/* Render other content once token check is completed */}
    </div>
  );
};

export default Chat;
