import { TranslateResponse } from '../../interfaces/translate.response';

export const translateUseCase = async (prompt: string, lang: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_GPT_API_URL}/gpt/translate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, lang }),
      }
    );

    if (!response.ok) throw new Error('Error al realizar la traducción');

    const data = (await response.json()) as TranslateResponse;

    return {
      ok: true,
      message: data.message,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'No se pudo traducir',
    };
  }
};
