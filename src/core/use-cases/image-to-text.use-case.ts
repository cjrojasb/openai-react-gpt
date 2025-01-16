export const imageToTextUseCase = async (file: File, prompt?: string) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (prompt) {
      formData.append('prompt', prompt);
    }
    const response = await fetch(
      `${import.meta.env.VITE_GPT_API_URL}/gpt/image-to-text`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = (await response.json()) as {
      message: string;
    };

    if (!response.ok) throw new Error('Error en la petición');

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
