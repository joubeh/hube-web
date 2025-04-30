import { ImageGenerationModel, TextModel } from "@/types/chatgpt";

export const imageGenerationModels: ImageGenerationModel[] = [
  // {
  //   model: "gpt-image-1",
  //   name: "GPT Image 1",
  //   description: "جدیدترین مدل تولید عکس",
  //   qualities: ["low", "medium", "high"],
  //   sizes: ["1024x1024", "1024x1536", "1536x1024"],
  //   pricing: {
  //     low: {
  //       "1024x1024": 0.011,
  //       "1024x1536": 0.016,
  //       "1536x1024": 0.016,
  //     },
  //     medium: {
  //       "1024x1024": 0.042,
  //       "1024x1536": 0.063,
  //       "1536x1024": 0.063,
  //     },
  //     high: {
  //       "1024x1024": 0.167,
  //       "1024x1536": 0.25,
  //       "1536x1024": 0.25,
  //     },
  //   },
  // },
  {
    model: "dall-e-3",
    name: "DALL·E 3",
    description: "جدیدترین مدل تولید عکس",
    // description: 'مدل قبلی تولید عکس',
    qualities: ["standard", "hd"],
    sizes: ["1024x1024", "1024x1792", "1792x1024"],
    pricing: {
      standard: {
        "1024x1024": 0.04,
        "1024x1792": 0.08,
        "1792x1024": 0.08,
      },
      hd: {
        "1024x1024": 0.08,
        "1024x1792": 0.12,
        "1792x1024": 0.12,
      },
    },
  },
  {
    model: "dall-e-2",
    name: "DALL·E 2",
    description: "مدل قبلی تولید عکس",
    // description: 'قدیمی ترین مدل تولید عکس',
    qualities: ["standard"],
    sizes: ["256x256", "512x512", "1024x1024"],
    pricing: {
      standard: {
        "256x256": 0.016,
        "512x512": 0.018,
        "1024x1024": 0.02,
      },
    },
  },
];

export const textModels: TextModel[] = [
  {
    model: "gpt-4o",
    name: "ChatGPT 4o",
    description: "برای اکثر سوالات عالی است",
    canReasoning: false,
    canWebSearch: true,
    canFileSearch: false,
    input_price_per_million_tokens: 2.5,
    output_price_per_million_tokens: 10,
  },
  // {
  //   model: 'o3',
  //   name: 'ChatGPT o3',
  //   description: 'قوی ترین در استدلال پیشرفته',
  //   canReasoning: true,
  //   canWebSearch: false,
  //   canFileSearch: false,
  //   canGenerateImage: false,
  //   input_price_per_million_tokens: 10,
  //   output_price_per_million_tokens: 40,
  // },
  {
    model: "o4-mini",
    name: "ChatGPT o4 mini",
    description: "سریع‌ترین در استدلال پیشرفته",
    canReasoning: true,
    canWebSearch: false,
    canFileSearch: false,
    input_price_per_million_tokens: 1.1,
    output_price_per_million_tokens: 4.4,
  },
  {
    model: "gpt-4o-mini",
    name: "ChatGPT 4o mini",
    description: "عالی برای کارهای روزمره",
    canReasoning: false,
    canWebSearch: true,
    canFileSearch: false,
    input_price_per_million_tokens: 0.15,
    output_price_per_million_tokens: 0.6,
  },
];
