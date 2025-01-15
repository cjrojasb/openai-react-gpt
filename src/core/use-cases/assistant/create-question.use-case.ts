import { CreateQuestionResponse } from '../../../interfaces/create-question.response';

interface Options {
  threadId: string;
  question: string;
}

export const createQuestionUseCase = async ({
  threadId,
  question,
}: Options): Promise<CreateQuestionResponse[]> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_GPT_API_URL}/assistant/user-question`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ threadId, question }),
      }
    );

    const replies = (await response.json()) as CreateQuestionResponse[];

    return replies;
  } catch (error) {
    throw new Error(`Error posting question ${error}`);
  }
};
