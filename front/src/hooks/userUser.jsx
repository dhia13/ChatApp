import { useEffect, useState } from 'react';
import api from '../api/axiosInstance';

const useUser = () => {
  const [user, setUser] = useState(null); // Use null as the initial state to represent the loading state

  useEffect(() => {
    const checkUserAuthentication = async () => {
      try {
        const res = await api.put(
          '/checkAccess',
          {},
          { withCredentials: true }
        );

        if (res.status === 200) {
          setUser({ isLogged: true, user: res.data });
        } else {
          setUser({ isLogged: false, user: null });
        }
      } catch (err) {
        setUser({ isLogged: false, user: null });
      }
    };

    checkUserAuthentication();
  }, []);

  return user;
};

export default useUser;
