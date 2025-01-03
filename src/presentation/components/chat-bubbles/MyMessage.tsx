import { AvatarMessage } from '../ui/AvatarMessage';

interface Props {
  text: string;
}

export const MyMessage = ({ text }: Props) => {
  return (
    <div className='col-start-6 col-end-13 p-3 rounded-lg'>
      <div className='flex items-center justify-start flex-row-reverse gap-3'>
        <AvatarMessage label='C' bgColor='bg-indigo-500' />
        <div className='relative text-sm bg-gray-500 bg-opacity-25 pt-3 pb-2 px-4 shadow rounded-xl'>
          <div>{text}</div>
        </div>
      </div>
    </div>
  );
};
