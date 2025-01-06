export async function* prosConsDiscusserStreamGeneratorUseCase(prompt: string) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_GPT_API_URL}/pros-cons-discusser-stream`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      }
    );

    if (!response.ok) throw new Error('Error en la petición');

    const reader = response.body?.getReader();

    if (!reader) {
      console.log('Error en la lectura del body getReader');
      return null;
    }

    const decoder = new TextDecoder();

    let text = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      const decodedChunk = decoder.decode(value, { stream: true });
      text += decodedChunk;

      yield text;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}
