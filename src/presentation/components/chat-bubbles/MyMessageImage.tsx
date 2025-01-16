import { AvatarMessage } from '../ui/AvatarMessage';

interface Props {
  text: string;
  imageUrl: string;
  alt: string;
  onImageSelected?: (newImageUrl: string) => void;
}

export const MyMessageImage = ({
  text,
  imageUrl,
  alt,
  onImageSelected,
}: Props) => {
  return (
    <div className='col-start-6 col-end-13 p-3 rounded-lg'>
      <div className='flex flex-row items-start gap-3'>
        <AvatarMessage label='G' bgColor='bg-green-500' />
        <div className='flex flex-col gap-2 relative text-sm bg-black bg-opacity-25 pt-3 pb-2 px-4 shadow rounded-xl'>
          {text && <span>{text}</span>}
          <img
            onClick={() => onImageSelected && onImageSelected(imageUrl)}
            src={imageUrl}
            alt={alt}
            className={`rounded-xl w-96 h-96 object-cover ${
              onImageSelected ? 'cursor-pointer' : ''
            }`}
          />
        </div>
      </div>
    </div>
  );
};
