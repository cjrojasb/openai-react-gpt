type GeneratedImage = Image | null;

interface Image {
  url: string;
  alt: string;
}

export const imageVariationUseCase = async (
  originalImage: string
): Promise<GeneratedImage> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_GPT_API_URL}/gpt/image-variation`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ baseImage: originalImage }),
      }
    );

    const { url, revised_prompt: alt } = await response.json();

    return {
      url,
      alt,
    };
  } catch (error) {
    console.log({ error });
    return null;
  }
};
