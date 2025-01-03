import type { OrthographyResponse } from '../../interfaces/orthography.response';

export const orthographyUseCase = async (prompt: string) => {
  try {
    const apiUrl = `${import.meta.env.VITE_GPT_API_URL}/orthography-check`;
    console.log({ apiUrl });
    const response = await fetch(
      `${import.meta.env.VITE_GPT_API_URL}/orthography-check`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // TODO add to mappping
        body: JSON.stringify({ prompt }),
      }
    );

    if (!response.ok) throw new Error('Error en la petición');

    const data = (await response.json()) as OrthographyResponse;

    return {
      ok: true,
      ...data,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      userScore: 0,
      errors: [],
      message: 'No se pudo procesar la solicitud',
    };
  }
};
