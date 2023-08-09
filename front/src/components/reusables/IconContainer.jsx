import React from 'react';
import PropTypes from 'prop-types';

const IconContainer = ({ handleClick, children, className }) => {
  return (
    <div
      className={`flex justify-center items-center w-[40px] ${className}`}
      onClick={handleClick}
    >
      <div className="w-[40px] h-[40px] rounded-full text-2xl hover:border-blue-400 bg-gray-300 shadow-md hover:shadow-lg hover:bg-gray-400 border border-blue-200 cursor-pointer justify-center items-center flex">
        {children}
      </div>
    </div>
  );
};

IconContainer.propTypes = {
  handleClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

IconContainer.defaultProps = {
  className: '',
};

export default IconContainer;
