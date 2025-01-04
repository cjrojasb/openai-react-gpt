import type { ProsConsDiscusserResponse } from '../../interfaces/pros-cons-discusser.response';

interface ProsConsDiscusserResponseFetch extends ProsConsDiscusserResponse {
  ok: boolean;
}

export const prosConsDiscusserUseCase = async (
  prompt: string
): Promise<ProsConsDiscusserResponseFetch> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_GPT_API_URL}/pros-cons-discusser`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      }
    );

    if (!response.ok) throw new Error('Error en la petición');

    const data = (await response.json()) as ProsConsDiscusserResponse;

    return {
      ok: true,
      ...data,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      role: '',
      content: '',
    };
  }
};
