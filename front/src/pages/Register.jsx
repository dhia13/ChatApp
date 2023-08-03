import { useState, useEffect } from 'react';
import 'react-calendar/dist/Calendar.css';
import PasswordInput from '../components/Auth/PasswordInput';
import Input from '../components/Auth/Input';
import SelectGender from '../components/Auth/SelectGender';
import { Link } from 'react-router-dom';
import Logo from '../assets/logos/logo.png';
import Bg from '../assets/images/messaging.jpg';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import valid from '../assets/icons/valid.png';
import invalid from '../assets/icons/invalid.png';
import api from '../api/axiosInstance';

function Register() {
  const [registerStep, setRegisterStep] = useState(0);
  // password scope
  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');
  useEffect(() => {
    function validatePassword(password) {
      if (password.length < 8) {
        return 'Password should be at least 8 characters long.';
      }
      if (!/[A-Z]/.test(password)) {
        return 'Password should contain at least one uppercase letter.';
      }
      if (!/\d/.test(password)) {
        return 'Password should contain at least one number.';
      }
      return true;
    }
    let validationResult = validatePassword(password);
    if (typeof validationResult === 'string') {
      setPasswordError(true);
      setPasswordErrorMsg(validationResult);
      setValidPassword(false);
    } else if (
      typeof validationResult === 'boolean' &&
      validationResult === true
    ) {
      setPasswordError(false);
      setValidPassword(true);
    }
  }, [password]);
  // confirmPassword scope
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validConfirmPassword, setValidConfirmPassword] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  useEffect(() => {
    if (password === confirmPassword) {
      setValidConfirmPassword(true);
      setConfirmPasswordError(false);
    } else {
      setValidConfirmPassword(false);
      setConfirmPasswordError(true);
    }
  }, [password, confirmPassword]);

  // email scope
  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMsg, setEmailErrorMsg] = useState('');
  useEffect(() => {
    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
    if (!isValidEmail(email)) {
      setEmailError(true);
      setEmailErrorMsg('Invalid Email');
    } else {
      // check if email exists in db
      const checkAvailability = async (email) => {
        await api
          .post(`/checkEmailAvailability`, {
            email,
          })
          .then((res) => {
            if (res.data.success) {
              setEmailError(false);
              setValidEmail(true);
            }
          })
          .catch((e) => {
            setEmailError(true);
            setEmailErrorMsg('Email already registered try to login');
            setValidEmail(false);
          });
      };
      checkAvailability(email);
    }
  }, [email]);

  const [username, setUsername] = useState('');
  const [validUsername, setValidUsername] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [usernameErrMsg, setUsernameErrMsg] = useState('');
  useEffect(() => {
    if (username.length < 6) {
      setUsernameError(true);
      setUsernameErrMsg('username must be at least 6 caracters long');
      setValidUsername(false);
    } else {
      const checkAvailability = async (username) => {
        await api
          .post(`/checkUsernameAvailability`, {
            username,
          })
          .then((res) => {
            if (res.data.success) {
              setUsernameError(false);
              setValidUsername(true);
            }
          })
          .catch((e) => {
            setUsernameError(true);
            setUsernameErrMsg('username already taken');
            setValidUsername(false);
          });
      };
      checkAvailability(username);
    }
  }, [username]);

  const [disable2, setDisable2] = useState(false);
  const genderList = ['Male', 'Female'];
  const [gender, setGender] = useState(genderList[0]);
  const [name, setName] = useState('');
  const [validName, setValidName] = useState(false);
  const [nameError, setNameError] = useState(false);
  const nameErrorMsg = 'Please enter your name';
  useEffect(() => {
    if (name === ' ') {
      setValidName(false);
      setNameError(true);
    } else {
      if (name.length > 3) {
        setValidName(true);
        setNameError(false);
      }
    }
  }, [name]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [disable, setDisable] = useState(true);
  useEffect(() => {
    if (validEmail && validPassword && validConfirmPassword) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [validEmail, validPassword, validConfirmPassword]);
  useEffect(() => {
    if (validName && validUsername) {
      setDisable2(false);
    } else {
      setDisable2(true);
    }
  }, [validName, validUsername]);
  const [success, setSuccess] = useState(false);
  // submit
  const handleSubmit = async (e) => {
    if (validEmail && validPassword && validConfirmPassword) {
      setLoading(true);
      await api
        .post(
          `/register`,
          {
            email,
            password,
            username,
            birthday,
            gender,
            name,
          },
          { withCredentials: true }
        )
        .then((res) => {
          setLoading(false);
          setError(false);
          setSuccess(true);
          localStorage.setItem('userData', JSON.stringify(res.data.data));
        })
        .catch((error) => {
          setError(true);
          setErrMsg(error.msg);
          setLoading(false);
        });
    }
  };
  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setRegisterStep(3);
      }, 1000);
    }
  }, [success]);
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(false);
      }, 5000);
    }
  }, [error]);
  const [birthday, setBirthday] = useState(new Date());

  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col overflow-hidden relative">
      <div className="absolute w-full h-full top-0 left-0">
        <img src={Bg} alt="bg" className="w-full h-full" />
      </div>
      <main className="flex justify-start items-center flex-col z-40 rounded-lg bg-white shadow-lg p-2">
        <div className="w-full h-full flex items-center justify-start  flex-col  ">
          <Link to="/">
            <img
              className={`w-[120px] lg:block mx-10 cursor-pointer`}
              src={Logo}
              alt="Logo"
            />
          </Link>
          {/*inputs  */}
          {registerStep === 0 && (
            <div className="w-[450px] flex flex-col items-center justify-center pt-4">
              <form className="flex justify-center items-center gap-3 flex-col">
                <Input
                  label="Email"
                  placeholder="Enter email"
                  value={email}
                  setValue={setEmail}
                  valid={validEmail}
                  error={emailError}
                  errorMsg={emailErrorMsg}
                />
                <PasswordInput
                  label="Password"
                  placeholder="Enter password"
                  value={password}
                  setValue={setPassword}
                  valid={validPassword}
                  error={passwordError}
                  showIcon={true}
                  errorMsg={passwordErrorMsg}
                />
                <PasswordInput
                  label="Confirm password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  setValue={setConfirmPassword}
                  valid={validConfirmPassword}
                  error={confirmPasswordError}
                  errorMsg="passwords does not match"
                  showIcon={true}
                />
                {/* <Input value={password} setValue={setPassword} /> */}
              </form>
              <div className="flex justify-center items-center flex-col h-[40px] my-2 w-72 mx-5 ">
                <button
                  disabled={disable}
                  onClick={() => setRegisterStep(1)}
                  className={`flex justify-center items-center border rounded-md h-full w-full shadow-sm ${
                    disable
                      ? 'bg-gray-200 cursor-not-allowed'
                      : 'bg-blue-400 hover:bg-blue-500'
                  } `}
                >
                  <h2 className="text-white text-sm font-semibold">Next</h2>
                </button>
              </div>
              <div className="flex justify-center items-center flex-col h-[30px] my-1 w-[272px] mx-5">
                {error && (
                  <h1 className="text-md font-semibold text-red-500 text-center">
                    {errMsg}
                  </h1>
                )}
              </div>
              <div className="h-12 flex justify-center items-center my-2 text-center">
                <p className="text-sm">Already have an account?</p>
                <Link to="/login">
                  <p className="px-1 text-sm text-button-color cursor-pointer">
                    Login
                  </p>
                </Link>
              </div>
            </div>
          )}
          {registerStep === 1 && (
            <div className="w-[450px] bg-white flex flex-col   shadow-sm items-center justify-center pt-4">
              <form className="flex justify-center items-center gap-3 flex-col">
                <Input
                  label="Username"
                  placeholder="Enter username"
                  value={username}
                  setValue={setUsername}
                  valid={validUsername}
                  error={usernameError}
                  errorMsg={usernameErrMsg}
                />
                <Input
                  label="Name"
                  placeholder="Fullname"
                  value={name}
                  setValue={setName}
                  valid={validName}
                  error={nameError}
                  errorMsg={nameErrorMsg}
                />
                <SelectGender
                  value={gender}
                  setValue={setGender}
                  gender={genderList}
                />
              </form>
              <div className="flex justify-center items-center flex-col h-[40px] mb-2 mt-10 w-72 mx-5 ">
                <button
                  disabled={disable2}
                  onClick={() => setRegisterStep(2)}
                  className={`flex justify-center items-center border rounded-md h-full w-full shadow-sm ${
                    disable2
                      ? 'bg-gray-200 cursor-not-allowed'
                      : 'bg-blue-400 hover:bg-blue-500'
                  } `}
                >
                  <h2 className="text-white text-sm font-semibold">Next</h2>
                </button>
              </div>
              <div className="flex justify-center items-center flex-col h-[30px] my-1 w-[272px] mx-5">
                {error ? (
                  <h1 className="text-md font-semibold text-red-500 text-center">
                    {errMsg}
                  </h1>
                ) : (
                  <></>
                )}
              </div>
            </div>
          )}
          {registerStep === 2 && (
            <div className="w-[450px] bg-white flex flex-col h-[300px]  shadow-sm items-center justify-around pt-4">
              <form className="flex justify-center items-center gap-3 flex-col">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Birthday"
                    value={birthday}
                    onChange={(newValue) => setBirthday(newValue)}
                    className="w-[289px]"
                  />
                </LocalizationProvider>
              </form>
              <div className="flex justify-center items-center flex-col h-[40px] my-2 w-72 mx-5 ">
                <button
                  onClick={handleSubmit}
                  className={`flex justify-center items-center border rounded-md h-full w-full shadow-sm ${
                    loading
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
                        Register
                      </p>
                    </div>
                  )}
                </button>
              </div>
              <div className="flex justify-center items-center flex-col h-[30px] my-1 w-[272px] mx-5">
                {error ? (
                  <h1 className="text-md font-semibold text-red-500 text-center">
                    {errMsg}
                  </h1>
                ) : (
                  <></>
                )}
              </div>
            </div>
          )}
          {registerStep === 3 && (
            <div className="w-[450px] bg-white flex flex-col items-center justify-center pt-4 ">
              <div className="w-full h-full flex items-center justify-center  flex-col mx-5 my-1">
                {/* logo text button form button text */}
                <div className="w-register-w bg-white flex flex-col h-register-t1-w ">
                  {/* logo */}
                  <div className="flex justify-center items-center mx-5 pt-9 pb-1 ">
                    <img
                      src={require('../assets/icons/email.png')}
                      alt="email"
                      className="w-32 h-32"
                    />
                  </div>
                  {/* Confirmation text */}
                  <div className="justify-center items-center  mx-5  my-5 flex flex-col">
                    <h2
                      className=" h-10 w-56 text-center text-tiny font-semibold 
                                 text-gray-400"
                    >
                      Confirmation email was sent to {email}
                    </h2>
                  </div>
                </div>
                <Link to="/chat">
                  <h3 className="text-base my-4 cursor-pointer font-semibold">
                    Start Chating
                  </h3>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
export default Register;
