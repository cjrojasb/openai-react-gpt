import { useState } from 'react';
import { GptMessage } from '../../components/chat-bubbles/GptMessage';
import { TypingLoader } from '../../components/loaders/TypingLoader';
import { TextMessageBoxFile } from '../../components/chat-input-boxes/TextMessageBoxFile';
import { imageToTextUseCase } from '../../../core/use-cases/image-to-text.use-case';
import { MyMessageImage } from '../../components/chat-bubbles/MyMessageImage';

interface Message {
  text: string;
  isGpt: boolean;
  previewImage?: string | undefined;
}

type Messages = Array<Message>;

export const ImageToTextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Messages>([]);

  const handlePostMessage = async (text: string, file: File) => {
    setIsLoading(true);
    setMessages((prev) => [
      ...prev,
      { text, isGpt: false, previewImage: URL.createObjectURL(file) },
    ]);
    const response = await imageToTextUseCase(file, text);
    setIsLoading(false);

    if (!response) return;

    setMessages((prev) => [...prev, { text: response.message, isGpt: true }]);
  };

  return (
    <div className='chat-container'>
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>
          <GptMessage text='Hola, ¿Qué imagen quieres que interprete hoy?' />
          {messages.map(({ text, isGpt, previewImage }, index) =>
            isGpt ? (
              <GptMessage key={index} text={text} />
            ) : (
              <MyMessageImage
                key={index}
                text={
                  text === '' ? 'Transcribe la imagen que logras ver' : text
                }
                imageUrl={previewImage ?? ''}
                alt={text}
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
        placeholder='Escribe aquí un mensaje para GPT-4o de lo que deseas que interprete'
        accept='image/*'
      />
    </div>
  );
};
