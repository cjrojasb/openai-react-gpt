export const textToAudioUseCase = async (prompt: string, voice: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_GPT_API_URL}/gpt/text-to-audio`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, voice }),
      }
    );

    if (!response.ok)
      throw new Error('No se pudo realizar la generación del audio');

    const audioFile = await response.blob();
    const audioUrl = URL.createObjectURL(audioFile);

    return {
      ok: true,
      message: prompt,
      audioUrl,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'No se pudo realizar la generación del audio',
      audioUrl: '',
    };
  }
};
