import { FormEvent, useState } from 'react';

interface Props {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disableCorrections?: boolean;
  abortSignal?: boolean;
  disabledAbortSignal?: boolean;
  onAbortSignal?: () => void;
}

export const TextMessageBox = ({
  onSendMessage,
  placeholder = '',
  disableCorrections = false,
  abortSignal = false,
  disabledAbortSignal = false,
  onAbortSignal,
}: Props) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (message.trim().length === 0) return;
    onSendMessage(message);
    setMessage('');
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className='flex flex-row items-center h-16 rounded-xl bg-white w-full px-4'
    >
      <div className='flex-grow'>
        <div className='relative w-full'>
          <input
            type='text'
            autoFocus
            name='message'
            className='flex w-full border rounded-xl text-gray-800 focus:outline-none focus:border-indigo-300 pl-4 h-10'
            placeholder={placeholder}
            autoComplete={disableCorrections ? 'on' : 'off'}
            autoCorrect={disableCorrections ? 'on' : 'off'}
            spellCheck={disableCorrections ? true : false}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        </div>
      </div>
      <div className='ml-4 flex flex-row gap-4'>
        {abortSignal && (
          <button
            disabled={disabledAbortSignal}
            className='flex items-center justify-center rounded-full bg-slate-500 p-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-slate-500/20 transition-all hover:shadow-lg hover:shadow-slate-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
            data-ripple-light='true'
            onClick={() => onAbortSignal && onAbortSignal()}
          >
            <i className='fa-solid fa-stop text-lg leading-none'></i>
          </button>
        )}
        <button className='btn-primary' disabled={message.trim().length === 0}>
          <span className='mr-2 font-bold'>Send</span>
          <i className='fa-regular fa-paper-plane'></i>
        </button>
      </div>
    </form>
  );
};
