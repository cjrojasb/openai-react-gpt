import { useState } from 'react';
import { GptMessage } from '../../components/chat-bubbles/GptMessage';
import { MyMessage } from '../../components/chat-bubbles/MyMessage';
import { TypingLoader } from '../../components/loaders/TypingLoader';
import { TextMessageBoxSelect } from '../../components/chat-input-boxes/TextMessageBoxSelect';
import { translateUseCase } from '../../../core/use-cases/translate.use-case';

interface Message {
  text: string;
  isGpt: boolean;
}

const languages = [
  { id: 'alemán', text: 'Alemán' },
  { id: 'árabe', text: 'Árabe' },
  { id: 'bengalí', text: 'Bengalí' },
  { id: 'francés', text: 'Francés' },
  { id: 'hindi', text: 'Hindi' },
  { id: 'inglés', text: 'Inglés' },
  { id: 'japonés', text: 'Japonés' },
  { id: 'mandarín', text: 'Mandarín' },
  { id: 'portugués', text: 'Portugués' },
  { id: 'ruso', text: 'Ruso' },
];

type Messages = Array<Message>;

export const TranslatePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Messages>([]);

  const handlePostMessage = async (message: string, selectedOption: string) => {
    console.log({ message, selectedOption });
    const userMessage = `Traduce: "${message}" al idioma "${selectedOption}"`;
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: userMessage, isGpt: false }]);
    const { ok, message: text } = await translateUseCase(
      message,
      selectedOption
    );
    setIsLoading(false);

    if (!ok) return alert(message);

    setMessages((prev) => [
      ...prev,
      {
        text,
        isGpt: true,
      },
    ]);
  };

  return (
    <div className='chat-container'>
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>
          <GptMessage text='Qué quieres que traduzca hoy' />
          {messages.map(({ text, isGpt }, index) =>
            isGpt ? (
              <GptMessage key={index} text={text} />
            ) : (
              <MyMessage key={index} text={text} />
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
        disableCorrections={true}
        options={languages}
      />
    </div>
  );
};
