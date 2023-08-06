import { useRef, useState } from 'react';
import { LiaPaperPlaneSolid } from 'react-icons/lia';
import { GrEmoji } from 'react-icons/gr';
import AudioMessage from './AudioMessage';
import EmojiPicker from 'emoji-picker-react';
import IconContainer from './IconContainer';

const MessagingInput = ({ message, setMessage, handleSendMessage }) => {
  const [showEmojiMenu, setShowEmojiMenu] = useState(false);
  const handleEmojiClicked = (e) => {
    const newMsg = message.split('');
    newMsg.push(e.emoji);
    setMessage(newMsg.join(''));
    setShowEmojiMenu(false);
    inputRef.current.focus();
  };
  const inputRef = useRef();
  return (
    <form
      className="w-full h-[80px] flex justify-center items-center relative"
      onSubmit={(e) => handleSendMessage(e)}
    >
      <div className="w-[80%] h-[60px] mb-[20px] bg-gray-300 items-center rounded-md flex justify-around">
        {showEmojiMenu && (
          <div className="absolute left-6 top-0 -translate-y-[100%] z-40">
            <EmojiPicker
              className="bg-red-200"
              Theme="dark"
              onEmojiClick={(e) => handleEmojiClicked(e)}
            />
          </div>
        )}
        <div className="">
          <IconContainer handleClick={() => setShowEmojiMenu(true)}>
            <GrEmoji />
          </IconContainer>
        </div>

        <input
          className="w-[80%] h-[60px] bg-gray-300 border-none outline-none rounded-md text-black placeholder:text-gray-800"
          value={message}
          type="text"
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Send a message"
          ref={inputRef}
        />
        {message === '' ? (
          <LiaPaperPlaneSolid
            className={` text-2xl cursor-pointer hover:text-blue-700 ${
              message !== '' && 'text-blue-900'
            }`}
            onClick={(e) => handleSendMessage(e)}
          />
        ) : (
          <LiaPaperPlaneSolid
            className={`text-2xl cursor-pointer hover:text-blue-700 ${
              message !== '' && 'text-blue-900'
            }`}
            onClick={(e) => handleSendMessage(e)}
          />
        )}
        {/* <AudioMessage /> */}
      </div>
    </form>
  );
};

export default MessagingInput;
