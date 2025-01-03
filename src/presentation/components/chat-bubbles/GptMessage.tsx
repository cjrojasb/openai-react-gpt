import Markdown from 'react-markdown';
import { AvatarMessage } from '../ui/AvatarMessage';

interface Props {
  text: string;
}

export const GptMessage = ({ text }: Props) => {
  return (
    <div className='col-start-1 col-end-8 p-3 rounded-lg'>
      <div className='flex flex-row items-start gap-3'>
        <AvatarMessage label='G' bgColor='bg-green-500' />
        <div className='relative text-sm bg-black bg-opacity-25 pt-3 pb-2 px-4 shadow rounded-xl'>
          <Markdown>{text}</Markdown>
        </div>
      </div>
    </div>
  );
};
