import { useSelector } from 'react-redux';
import { useSocket } from '../../HOC/SocketContext';

const OutGoingCall = () => {
  const { to, callState } = useSelector((state) => state.calls);
  const { endCall, otherVideoRef, myVideoRef } = useSocket();
  return (
    <div className="absolute w-screen h-screen z-50 flex-center bg-green-400 flex-col gap-4">
      <h1>Calling : {to.name}</h1>
      <p>Call state : {callState}</p>
      {/* My video */}
      <div className="flex-center gap-4">
        <video
          ref={myVideoRef}
          className="w-[200px] h-[120px] border-2 border-blue-500"
          autoPlay
          inline="true"
          muted
        />
        {callState === 'connected' && (
          <video
            ref={otherVideoRef}
            className="w-[200px] h-[120px] border-2 border-blue-500"
          />
        )}
      </div>
      <div className="flex-center gap-4">
        <button className="bg-red-400 p-4" onClick={endCall}>
          End Call
        </button>
      </div>
    </div>
  );
};

export default OutGoingCall;
