import { AvatarMessage } from '../ui/AvatarMessage';

interface Props {
  userScore: number;
  errors: string[];
  message: string;
}

export const GptOrthographyMessage = ({
  userScore,
  errors,
  message,
}: Props) => {
  return (
    <div className='col-start-1 col-end-8 p-3 rounded-lg'>
      <div className='flex flex-row items-start gap-3'>
        <AvatarMessage label='G' bgColor='bg-green-500' />
        <div className='relative text-sm bg-black bg-opacity-25 pt-3 pb-2 px-4 shadow rounded-xl'>
          <h3>Points: {userScore}%</h3>
          <p>{message}</p>
          {errors.length === 0 ? (
            <p>No se encontraron errores</p>
          ) : (
            <>
              <h3 className='text-xl ml-1'>
                Errores encontrados
                <span className='font-bold'>({errors.length})</span>
              </h3>
              <ul>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
