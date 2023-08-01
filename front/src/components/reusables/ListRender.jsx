import React from 'react';
import LoadingContact from './Loading/LoadingContact';
import styled from 'styled-components';

const ListRender = ({ loading, children, loadingNumber }) => {
  if (loading) {
    const loadingContacts = Array.from(
      { length: loadingNumber },
      (_, index) => <LoadingContact key={index} />
    );

    return (
      <div className="h-[calc(100%-142px)] w-full">
        <ChatMenu>{loadingContacts}</ChatMenu>
      </div>
    );
  }
  return (
    <div className="h-[calc(100%-142px)]  w-full flex-col">
      <ChatMenu>{children}</ChatMenu>
    </div>
  );
};
export default ListRender;
const ChatMenu = styled.div`
  /* Set a fixed height and width for the container to enable scrolling */
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  height: 100%;
  flex-direction: column;
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 8px;
  /* Hide the default scrollbar */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */

  /* For WebKit based browsers (Chrome, Safari, Opera) */
  &::-webkit-scrollbar {
    width: 5px;
  }

  /* For WebKit based browsers (Chrome, Safari, Opera) */
  &::-webkit-scrollbar-thumb {
    background-color: rgb(147 197 253);
    border-radius: 4px;
  }

  /* For WebKit based browsers (Chrome, Safari, Opera) */
  &::-webkit-scrollbar-thumb:hover {
    background-color: rgb(147 197 253);
  }

  /* For WebKit based browsers (Chrome, Safari, Opera) */
  &::-webkit-scrollbar-thumb:active {
    background-color: rgb(147 197 253);
  }

  /* For WebKit based browsers (Chrome, Safari, Opera) */
  &::-webkit-scrollbar-track {
    background-color: #f1f1f1;
    border-radius: 5px;
  }

  /* For WebKit based browsers (Chrome, Safari, Opera) */
  &::-webkit-scrollbar-track:hover {
    background-color: #e0e0e0;
  }
`;
