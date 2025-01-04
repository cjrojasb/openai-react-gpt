import { useState } from 'react';
import { GptMessage } from '../../components/chat-bubbles/GptMessage';
import { MyMessage } from '../../components/chat-bubbles/MyMessage';
import { TextMessageBox } from '../../components/chat-input-boxes/TextMessageBox';
import { TypingLoader } from '../../components/loaders/TypingLoader';
import { orthographyUseCase } from '../../../core/use-cases/orthography.use-case';
import { GptOrthographyMessage } from '../../components/chat-bubbles/GptOrthographyMessage';

interface Message {
  text: string;
  isGpt: boolean;
  info?: Info;
}

interface Info {
  userScore: number;
  errors: string[];
  message: string;
}

type Messages = Array<Message>;

export const OrthographyPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Messages>([]);

  const handlePostMessage = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: message, isGpt: false }]);
    const { ok, message, userScore, errors } = await orthographyUseCase(text);
    setIsLoading(false);
    if (!ok) {
      setMessages((prev) => [
        ...prev,
        { text: 'No se pudo realizar la corrección', isGpt: true },
      ]);
      return;
    }
    setMessages((prev) => [
      ...prev,
      {
        text: message,
        isGpt: true,
        info: {
          userScore: userScore,
          errors: errors,
          message: message,
        },
      },
    ]);
  };

  return (
    <div className='chat-container'>
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>
          <GptMessage text='Hola, soy GPT-4o. ¿En qué puedo ayudarte?' />
          {messages.map((message, index) =>
            message.isGpt ? (
              <GptOrthographyMessage
                key={index}
                {...message.info!}
                // errors={message.info!.errors}
                // message={message.info!.message}
                // userScore={message.info!.userScore}
              />
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
