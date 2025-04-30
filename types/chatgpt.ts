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
  type: string;
  role: "user" | "assistant";
  content: string;
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
