import { useState, useEffect } from 'react';
import { GptMessage } from '../../components/chat-bubbles/GptMessage';
import { MyMessage } from '../../components/chat-bubbles/MyMessage';
import { TextMessageBox } from '../../components/chat-input-boxes/TextMessageBox';
import { TypingLoader } from '../../components/loaders/TypingLoader';
import { createThreadUseCase } from '../../../core/use-cases/assistant/create-thread.use-case';
import { createQuestionUseCase } from '../../../core/use-cases/assistant/create-question.use-case';

interface Message {
  text: string;
  isGpt: boolean;
}

type Messages = Array<Message>;

export const AssistantPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Messages>([]);
  const [threadId, setThreadId] = useState<string | null>(null);

  const handlePostMessage = async (message: string) => {
    if (!threadId) return;
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: message, isGpt: false }]);
    const replies = await createQuestionUseCase({
      threadId,
      question: message,
    });
    setIsLoading(false);

    for (const reply of replies) {
      for (const message of reply.content) {
        setMessages((prev) => [
          ...prev,
          {
            text: message,
            isGpt: reply.role === 'assistant',
            info: reply,
          },
        ]);
      }
    }

    // replies.forEach((reply) => {
    //   setMessages((prev) => [
    //     ...prev,
    //     {
    //       text: reply.content[0],
    //       isGpt: reply.role === 'assistant' ? true : false,
    //     },
    //   ]);
    // });
  };

  useEffect(() => {
    const fetchThreadId = async () => {
      const response = await createThreadUseCase();
      setThreadId(response.id);
      localStorage.setItem('threadId', response.id);
      return;
    };

    const threadIdFromStorage = localStorage.getItem('threadId');

    if (threadIdFromStorage) {
      setThreadId(threadIdFromStorage);
    } else {
      fetchThreadId();
    }
  }, []);

  // useEffect(() => {
  //   const threadId = localStorage.getItem('threadId');
  //   if (threadId) {
  //     setThreadId(threadId);
  //   } else {
  //     createThreadUseCase().then((response) => {
  //       setThreadId(response.id);
  //       localStorage.setItem('threadId', response.id);
  //     });
  //   }
  // }, []);

  useEffect(() => {
    if (threadId) {
      setMessages((prev) => [
        ...prev,
        { text: `ThreadID: ${threadId}`, isGpt: true },
      ]);
    }
  }, [threadId]);

  if (!threadId) {
    return (
      <div className='flex justify-center items-center h-full'>
        <TypingLoader />
      </div>
    );
  }

  return (
    <div className='chat-container'>
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>
          <GptMessage text='Hola, soy GPT-4o. ¿En qué puedo ayudarte?' />
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
      />
    </div>
  );
};
