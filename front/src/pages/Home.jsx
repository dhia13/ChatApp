import { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import HomeNavbar from '../components/UI/HomeNavbar';
import Loading from '../components/UI/Loading';

const Home = () => {
  const [isTokenChecked, setIsTokenChecked] = useState(true);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const checkToken = async () => {
      try {
        await api.put(
          `/checkAccess`,
          {},
          {
            withCredentials: true,
          }
        );
        setIsTokenChecked(true);
        setLoading(false);
      } catch (err) {
        setIsTokenChecked(false);
        setLoading(false);
      }
    };
    checkToken();
  }, []);

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="w-screen h-screen flex flex-col justify-start items-start overflow-hidden">
      <HomeNavbar
        isTokenChecked={isTokenChecked}
        setIsTokenChecked={setIsTokenChecked}
      />
      <div className="w-full h-[calc(100%-80px)] flex justify-center items-center">
        <div className="flex justify-center items-center w-2/3 h-full">
          Info
        </div>
        <div className="flex justify-center items-center w-1/3 h-full">Img</div>
      </div>
    </div>
  );
};

export default Home;
