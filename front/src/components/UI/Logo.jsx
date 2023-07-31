import React from 'react';
import { Link } from 'react-router-dom';
import LogoPng from '../../assets/logos/logo.png';

const Logo = ({ width }) => {
  return (
    <Link to="/">
      <img
        className={`w-[${width}px] lg:block mx-10 cursor-pointer`}
        src={LogoPng}
        alt="Logo"
      />
    </Link>
  );
};

export default Logo;
