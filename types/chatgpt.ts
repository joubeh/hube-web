export type Conversation = {
  id: string;
  userId: number;
  title: string;
  isHidden: boolean;
  isPublic: boolean;
};

export type Message = {
  id: number;
  conversationId: string;
  model: string;
  role: "user" | "assistant";
  content: string;
  useWebSearch: boolean;
  useReasoning: boolean;
  reasoningEffort: "low" | "medium" | "high" | null;
};

export type Pricing = {
  [quality: string]: {
    [size: string]: number;
  };
};

export type ImageGenerationModel = {
  model: string;
  name: string;
  description: string;
  qualities: string[];
  sizes: string[];
  pricing: Pricing;
};

export type GeneratedImage = {
  id: number;
  model: string;
  prompt: string;
  output: string | null;
  isDone: boolean;
  error: boolean;
  size: string;
  quality: string;
};

export type TextModel = {
  model: string;
  name: string;
  description: string;
  canReasoning: boolean;
  canWebSearch: boolean;
  canFileSearch: boolean;
  input_price_per_million_tokens: number;
  output_price_per_million_tokens: number;
};
