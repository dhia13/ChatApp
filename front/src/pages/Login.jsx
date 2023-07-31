import { useState, useEffect } from 'react';
import PasswordInput from '../components/Auth/PasswordInput';
import Input from '../components/Auth/Input';
import { Link, useNavigate } from 'react-router-dom';
import Bg from '../assets/images/messaging.jpg';
import valid from '../assets/icons/valid.png';
import invalid from '../assets/icons/invalid.png';
import api from '../api/axiosInstance';
import Logo from '../components/UI/Logo';
import { setUser } from '../store/Slices/userSlice';
import { useDispatch } from 'react-redux';
import { setNotificationAlert } from '../store/Slices/notificationsSlice';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isEmpty = (value) => {
    return value === '';
  };
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [password, setPassword] = useState('');
  const [disable, setDisable] = useState(true);
  const [success, setSuccess] = useState(false);
  const [loginSuccessData, setLoginSuccessData] = useState();
  useEffect(() => {
    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
    if (!isValidEmail(email)) {
      setValidEmail(false);
    } else {
      setValidEmail(true);
    }
  }, [email]);
  useEffect(() => {
    if (validEmail && !isEmpty(password)) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [validEmail, password]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validEmail && !isEmpty(password));
    setLoading(true);
    await api
      .post(
        `/login`,
        {
          email: email,
          password: password,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setLoading(false);
        setError(false);
        setSuccess(true);
        console.log(res.data);
        setLoginSuccessData(res.data.data);
      })
      .catch((error) => {
        setError(true);
        setLoading(false);
      });
  };
  useEffect(() => {
    if (success) {
      setTimeout(() => {
        dispatch(
          setUser({
            username: loginSuccessData.username,
            name: loginSuccessData.name,
            img: loginSuccessData.img,
            email: loginSuccessData.email,
            id: loginSuccessData.id,
            birthday: loginSuccessData.birthday,
          })
        );
        if (loginSuccessData.unseenNotificationsCount > 0) {
          console.log('dispatching');
          dispatch(
            setNotificationAlert(loginSuccessData.unseenNotificationsCount)
          );
        }
        navigate('/chat');
      }, 1000);
    }
  }, [success, loginSuccessData, navigate, dispatch]);
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(false);
      }, 5000);
    }
  }, [error]);
  return (
    <div className="w-screen h-screen flex justify-start items-start flex-col overflow-hidden relative">
      <div className="absolute w-full h-full top-0 left-0 flex justify-start items-start">
        <main className="h-full flex justify-start items-center flex-col z-40 bg-white">
          <section className="flex flex-col h-full">
            <div className="w-full h-full flex items-center justify-center  flex-col ">
              {/* logo */}
              <Logo width="80" />
              <div className="w-[400px] flex flex-col items-center justify-center pt-4">
                <form
                  className="flex justify-center items-center gap-3 flex-col"
                  onSubmit={handleSubmit}
                >
                  <Input
                    label="Email"
                    placeholder="Enter email"
                    value={email}
                    setValue={setEmail}
                    valid={validEmail}
                  />
                  <PasswordInput
                    label="Password"
                    placeholder="Enter password"
                    value={password}
                    setValue={setPassword}
                    valid={true}
                  />
                </form>
                <div className="flex justify-center items-center flex-col h-[40px] my-2 w-72 mx-5 ">
                  <button
                    disabled={disable}
                    onClick={handleSubmit}
                    className={`flex justify-center items-center border rounded-md h-full w-full shadow-sm ${
                      disable
                        ? 'bg-gray-200 cursor-not-allowed'
                        : loading
                        ? 'bg-green-500'
                        : error
                        ? 'bg-red-500'
                        : success
                        ? 'bg-green-500'
                        : 'bg-blue-400 hover:bg-blue-500'
                    } `}
                  >
                    {loading ? (
                      <img
                        src={require('../assets/icons/loading.gif')}
                        width={32}
                        height={32}
                        alt="loading..."
                      />
                    ) : error ? (
                      <img src={invalid} alt="invalid" width={24} height={24} />
                    ) : success ? (
                      <img src={valid} alt="valid" width={32} height={32} />
                    ) : (
                      <div>
                        <p className="font-semibold text-lg text-white">
                          Login
                        </p>
                      </div>
                    )}
                  </button>
                </div>
                <div className="flex justify-center items-center flex-col h-[30px] w-[272px] mx-5">
                  {error ? (
                    <h1 className="text-md font-semibold text-red-500 text-center">
                      Invalid credentials
                    </h1>
                  ) : (
                    <></>
                  )}
                </div>
                <h2 className="text-black text-xs font-semibold pb-2">
                  <Link to="/RequestPasswordReset">Forgot Password?</Link>
                </h2>
              </div>
              <div className="h-12 flex justify-center items-center my-2 text-center">
                <p className="text-sm">Don't have an account?</p>
                <Link to="/register">
                  <p className="px-1 text-sm text-button-color cursor-pointer">
                    Sign up
                  </p>
                </Link>
              </div>
            </div>
          </section>
        </main>
        <img src={Bg} className="w-full h-full" alt="doctor" />
      </div>
    </div>
  );
}
export default Login;
