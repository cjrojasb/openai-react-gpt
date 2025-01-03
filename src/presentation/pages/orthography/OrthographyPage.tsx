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

  const handlePostMessage = async (message: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: message, isGpt: false }]);
    const data = await orthographyUseCase(message);
    if (!data.ok) {
      setMessages((prev) => [
        ...prev,
        { text: 'No se pudo realizar la corrección', isGpt: true },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          text: data.message,
          isGpt: true,
          info: {
            userScore: data.userScore,
            errors: data.errors,
            message: data.message,
          },
        },
      ]);
    }
    setIsLoading(false);
    // TODO addMessage isGPT is true
  };

  // useEffect(() => {
  //   async function fetchData() {
  //     const response = await fetch('http://localhost:3000/gpt/health');
  //     const data = await response.json();
  //     return data;
  //   }
  //   fetchData();
  // }, []);

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
