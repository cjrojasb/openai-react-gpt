import type { AudioToTextResponse } from '../../interfaces/audioToText.response';

export const audioToTextUseCase = async (audioFile: File, prompt?: string) => {
  try {
    const formData = new FormData();
    formData.append('file', audioFile);
    if (prompt) {
      formData.append('prompt', prompt);
    }
    const response = await fetch(
      `${import.meta.env.VITE_GPT_API_URL}/audio-to-text`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = (await response.json()) as AudioToTextResponse;

    if (!response.ok) throw new Error('Error en la petición');

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
