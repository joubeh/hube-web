export const reasoningEffortOptions = ["low", "medium", "high"] as const;
export type ReasoningEffort = (typeof reasoningEffortOptions)[number] | null;
export const imageSizes = ["1024x1024", "1024x1792", "1792x1024"] as const;
export type ImageSize = (typeof imageSizes)[number] | null;
export const imageQualities = ["standard", "hd"] as const;
export type ImageQuality = (typeof imageQualities)[number] | null;

export interface ExtraOptions {
  reasoningEffort: ReasoningEffort;
  imageSize: ImageSize;
  imageQuality: ImageQuality;
}

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
  reasoningEffort: (typeof reasoningEffortOptions)[number] | null;
  imageSize: (typeof imageSizes)[number] | null;
  imageQuality: (typeof imageQualities)[number] | null;
  type: "text" | "image";
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
