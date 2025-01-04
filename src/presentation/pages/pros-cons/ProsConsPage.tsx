import { useState } from 'react';
import { GptMessage } from '../../components/chat-bubbles/GptMessage';
import { MyMessage } from '../../components/chat-bubbles/MyMessage';
import { TextMessageBox } from '../../components/chat-input-boxes/TextMessageBox';
import { TypingLoader } from '../../components/loaders/TypingLoader';
import { prosConsDiscusserUseCase } from '../../../core/use-cases/pros-cons-discusser.use-case';

interface Message {
  text: string;
  isGpt: boolean;
}

type Messages = Array<Message>;

export const ProsConsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Messages>([]);

  const handlePostMessage = async (message: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: message, isGpt: false }]);
    const { ok, content } = await prosConsDiscusserUseCase(message);
    setIsLoading(false);
    if (!ok) {
      setMessages((prev) => [
        ...prev,
        { text: 'No se pudo realizar la comparación', isGpt: true },
      ]);
      return;
    }
    setMessages((prev) => [
      ...prev,
      {
        text: content,
        isGpt: true,
      },
    ]);
  };

  return (
    <div className='chat-container'>
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>
          <GptMessage text='Puedes escribir lo que sea que quieres que compare y te de mis puntos de vista.' />
          {messages.map((message, index) =>
            message.isGpt ? (
              <GptMessage key={index} text={message.text} />
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
      <TextMessageBox
        onSendMessage={handlePostMessage}
        placeholder='Escribe aquí un mensaje para GPT-4o'
        disableCorrections={true}
      />
    </div>
  );
};
