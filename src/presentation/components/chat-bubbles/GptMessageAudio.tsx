import Markdown from 'react-markdown';
import { AvatarMessage } from '../ui/AvatarMessage';

interface Props {
  text: string;
  audioUrl: string;
}

export const GptMessageAudio = ({ text, audioUrl }: Props) => {
  return (
    <div className='col-start-1 col-end-8 p-3 rounded-lg'>
      <div className='flex flex-row items-start gap-3'>
        <AvatarMessage label='G' bgColor='bg-green-500' />
        <div className='relative text-sm bg-black bg-opacity-25 pt-3 pb-2 px-4 shadow rounded-xl'>
          <Markdown>{text}</Markdown>
          <audio className='w-full' autoPlay controls src={audioUrl}></audio>
        </div>
      </div>
    </div>
  );
};
