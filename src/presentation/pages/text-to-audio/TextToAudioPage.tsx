import { useState } from 'react';
import { GptMessage } from '../../components/chat-bubbles/GptMessage';
import { MyMessage } from '../../components/chat-bubbles/MyMessage';
import { TypingLoader } from '../../components/loaders/TypingLoader';
import { TextMessageBoxSelect } from '../../components/chat-input-boxes/TextMessageBoxSelect';
import { textToAudioUseCase } from '../../../core/use-cases/text-to-audio.use-case';
import { GptMessageAudio } from '../../components/chat-bubbles/GptMessageAudio';

const disclaimer = `
## ¿Qué audio quieres generar hoy?
* Todo el audio generado es por AI.
`;

const voices = [
  { id: 'nova', text: 'Nova' },
  { id: 'alloy', text: 'Alloy' },
  { id: 'echo', text: 'Echo' },
  { id: 'fable', text: 'Fable' },
  { id: 'onyx', text: 'Onyx' },
  { id: 'shimmer', text: 'Shimmer' },
];

interface TextMessage {
  text: string;
  isGpt: boolean;
  type: 'text';
}

interface AudioMessage {
  text: string;
  isGpt: boolean;
  audio: string;
  type: 'audio';
}

type Message = TextMessage | AudioMessage;

export const TextToAudioPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePostMessage = async (text: string, selectedVoice: string) => {
    setIsLoading(true);
    setMessages((prev) => [
      ...prev,
      { text: text, isGpt: false, type: 'text' },
    ]);
    const { ok, message, audioUrl } = await textToAudioUseCase(
      text,
      selectedVoice
    );
    if (!ok) return;
    setMessages((prev) => [
      ...prev,
      {
        text: `${selectedVoice} - ${message}`,
        isGpt: true,
        type: 'audio',
        audio: audioUrl,
      },
    ]);
    setIsLoading(false);
  };

  return (
    <div className='chat-container'>
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>
          <GptMessage text={disclaimer} />
          {messages.map((message, index) =>
            message.isGpt ? (
              message.type === 'audio' ? (
                <GptMessageAudio
                  key={index}
                  text={message.text}
                  audioUrl={message.audio}
                />
              ) : (
                <GptMessage key={index} text={message.text} />
              )
            ) : (
              <MyMessage key={index} text={message.text} />
            )
          )}
          {isLoading && (
            <div className='col-start-1 col-end-12 fade-in'>
              <TypingLoader />
            </div>
          )}
        </div>
      </div>
      <TextMessageBoxSelect
        onSendMessage={handlePostMessage}
        placeholder='Escribe aquí un mensaje para GPT-4o'
        options={voices}
      />
    </div>
  );
};
