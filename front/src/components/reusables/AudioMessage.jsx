import { useState } from 'react';
import IconContainer from './IconContainer';
import { BsFillMicFill } from 'react-icons/bs';
import { AiOutlineSend } from 'react-icons/ai';
import api from '../../api/axiosInstance';
const AudioMessage = () => {
  const [recording, setRecording] = useState('idle');
  const [recordedAudioBlob, setRecordedAudioBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const recordedBlob = new Blob(chunks, { type: 'audio/wav' });
        setRecordedAudioBlob(recordedBlob);
        setRecording('recorded');
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording('recording');
    } catch (error) {
      console.error('Error accessing the microphone:', error);
      setRecording('idle');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      const mediaStreamTracks = mediaRecorder.stream.getTracks();
      mediaStreamTracks.forEach((track) => track.stop());
    }
  };

  const handleSaveAudio = async () => {
    if (recordedAudioBlob) {
      try {
        const formData = new FormData();
        console.log(recordedAudioBlob);
        formData.append('audio', recordedAudioBlob, 'recorded_audio.wav');
        console.log('formData:', formData);

        const response = await api.post('/upload-audio', formData, {
          withCredentials: true,
        });

        if (response.status === 200) {
          setRecordedAudioBlob(null);
          setRecording('idle');
        } else {
          console.error('Failed to upload audio.');
        }
      } catch (error) {
        console.error('Error uploading audio:', error);
      }
    }
  };

  return (
    <>
      {recording === 'idle' ? (
        <IconContainer handleClick={startRecording}>
          <BsFillMicFill />
        </IconContainer>
      ) : recording === 'recording' ? (
        <IconContainer handleClick={stopRecording}>
          <BsFillMicFill className="text-red-600" />
        </IconContainer>
      ) : (
        <IconContainer handleClick={handleSaveAudio}>
          <AiOutlineSend className="text-green-500" />
        </IconContainer>
      )}
    </>
  );
};

export default AudioMessage;
