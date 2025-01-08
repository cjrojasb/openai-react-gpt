import { useState } from 'react';
import { GptMessage } from '../../components/chat-bubbles/GptMessage';
import { MyMessage } from '../../components/chat-bubbles/MyMessage';
import { TypingLoader } from '../../components/loaders/TypingLoader';
import { TextMessageBoxFile } from '../../components/chat-input-boxes/TextMessageBoxFile';
import { audioToTextUseCase } from '../../../core/use-cases/audio-to-text.use-case';

interface Message {
  text: string;
  isGpt: boolean;
}

type Messages = Array<Message>;

export const AudioToTextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Messages>([]);

  const handlePostMessage = async (text: string, audioFile: File) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text, isGpt: false }]);
    const response = await audioToTextUseCase(audioFile, text);
    setIsLoading(false);

    if (!response) return;

    const gptMessage = `
## Esta es la transcripción de audio a texto generado por la IA:
__Duración:__ ${Math.round(response.duration)} segundos
### El texto es:
${response.text};
`;

    setMessages((prev) => [...prev, { text: gptMessage, isGpt: true }]);

    for (const segment of response.segments) {
      const segmentMessage = `
__De ${Math.round(segment.start)} a ${Math.round(segment.end)} segundos:__
${segment.text}
`;

      setMessages((prev) => [...prev, { text: segmentMessage, isGpt: true }]);
    }
  };

  return (
    <div className='chat-container'>
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>
          <GptMessage text='Hola, ¿Qué audio quieres generar por la IA hoy?' />
          {messages.map(({ text, isGpt }, index) =>
            isGpt ? (
              <GptMessage key={index} text={text} />
            ) : (
              <MyMessage
                key={index}
                text={text === '' ? 'Transcribe el audio' : text}
              />
            )
          )}
          {isLoading && (
            <div className='col-start-1 col-end-12 fade-in'>
              <TypingLoader />
            </div>
          )}
        </div>
      </div>
      <TextMessageBoxFile
        onSendMessage={handlePostMessage}
        placeholder='Escribe aquí un mensaje para GPT-4o'
        accept='audio/*'
      />
    </div>
  );
};
