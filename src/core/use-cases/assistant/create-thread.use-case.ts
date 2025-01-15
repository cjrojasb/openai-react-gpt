import { CreateThreadResponse } from '../../../interfaces/create-thread.response';

export const createThreadUseCase = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_GPT_API_URL}/assistant/create-thread`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) throw new Error('Error al realizar la traducción');

    const data = (await response.json()) as CreateThreadResponse;

    return data;
  } catch (error) {
    throw new Error(`Error creating thread ${error}`);
  }
};
