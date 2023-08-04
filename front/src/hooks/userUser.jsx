import { useEffect } from 'react';
import api from '../api/axiosInstance';
import { setLogged, setNotLogged } from '../store/Slices/userSlice';
import { useDispatch } from 'react-redux';

const useUser = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const checkUserAuthentication = async () => {
      try {
        const res = await api.put(
          '/checkAccess',
          {},
          { withCredentials: true }
        );

        if (res.status === 200) {
          dispatch(setLogged());
        } else {
          dispatch(setNotLogged());
        }
      } catch (err) {}
    };

    checkUserAuthentication();
  }, [dispatch]);
};

export default useUser;
