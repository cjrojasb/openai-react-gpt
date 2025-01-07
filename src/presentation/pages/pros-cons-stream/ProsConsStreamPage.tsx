import { useRef, useState } from 'react';
import { GptMessage } from '../../components/chat-bubbles/GptMessage';
import { MyMessage } from '../../components/chat-bubbles/MyMessage';
import { TextMessageBox } from '../../components/chat-input-boxes/TextMessageBox';
import { TypingLoader } from '../../components/loaders/TypingLoader';
// import { prosConsDiscusserStreamUseCase } from '../../../core/use-cases/pros-cons-discusser-stream.use-case';
import { prosConsDiscusserStreamGeneratorUseCase } from '../../../core/use-cases/pros-cons-discusser-stream-generator.use-case';

interface Message {
  text: string;
  isGpt: boolean;
}

type Messages = Array<Message>;

export const ProsConsStreamPage = () => {
  const abortController = useRef(new AbortController());
  const isRunning = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Messages>([]);

  const handleAbortSignal = () => {
    abortController.current.abort();
    abortController.current = new AbortController();
    isRunning.current = false;
    setIsLoading(false);
  };

  const handlePostMessage = async (message: string) => {
    if (isRunning.current) {
      abortController.current.abort();
      abortController.current = new AbortController();
    }
    setIsLoading(true);
    isRunning.current = true;
    setMessages((prev) => [...prev, { text: message, isGpt: false }]);

    // * new code use prosConsDiscusserStreamGeneratorUseCase
    const stream = prosConsDiscusserStreamGeneratorUseCase(
      message,
      abortController.current.signal
    );
    setIsLoading(false);
    setMessages((prev) => [
      ...prev,
      {
        text: '',
        isGpt: true,
      },
    ]);

    for await (const textStream of stream) {
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].text = textStream;
        return newMessages;
      });
    }

    isRunning.current = false;

    // * old code use prosConsDiscusserStreamUseCase
    // const reader = await prosConsDiscusserStreamUseCase(message);
    // setIsLoading(false);

    // if (!reader) return;

    // // Generate last message
    // const decoder = new TextDecoder();
    // let gptMessage = '';

    // setMessages((prev) => [
    //   ...prev,
    //   {
    //     text: gptMessage,
    //     isGpt: true,
    //   },
    // ]);

    // while (true) {
    //   const { done, value } = await reader.read();
    //   if (done) break;

    //   const decodedChunk = decoder.decode(value, { stream: true });
    //   gptMessage += decodedChunk;
    //   setMessages((prev) => {
    //     const newMessages = [...prev];
    //     newMessages[newMessages.length - 1].text = gptMessage;
    //     return newMessages;
    //   });
    // }
  };

  return (
    <div className='chat-container'>
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>
          <GptMessage text='Hola, soy GPT-4o. ¿Qué deseas comparar hoy?' />
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
      <TextMessageBox
        onSendMessage={handlePostMessage}
        placeholder='Escribe aquí un mensaje para GPT-4o'
        disableCorrections={true}
        abortSignal={isRunning.current}
        disabledAbortSignal={isLoading}
        onAbortSignal={handleAbortSignal}
      />
    </div>
  );
};
