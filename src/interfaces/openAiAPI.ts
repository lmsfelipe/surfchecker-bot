import OpenAI from 'openai';
const client = new OpenAI();

export enum GPTModel {
  GPT4o = 'gpt-4o',
  GPT4o_MINI = 'gpt-4o-mini',
  GPT4o_SEARCH_PREVIEW = 'gpt-4o-search-preview',
}

export type Message = {
  role: Role;
  content: string;
};

type Role = 'user' | 'assistant' | 'system';

export async function openAiAPI(model: GPTModel, messages: Message[]) {
  const completion = await client.chat.completions.create({
    model,
    messages,
  });

  return completion;
}
