import {
  Conversation,
  ExtraOptions,
  reasoningEffortOptions,
  imageSizes,
  imageQualities,
  File,
} from "@/types/chatgpt";
import { create } from "zustand";
import { textModels } from "@/lib/chatgpt/models";

interface ConversationState {
  conversation?: Conversation;
  setConversation: (conversation: Conversation) => void;
  isTemporary: boolean;
  toggleIsTemporary: () => void;
  isWebSearch: boolean;
  toggleIsWebSearch: () => void;
  isReasoning: boolean;
  toggleIsReasoning: () => void;
  isImageGeneration: boolean;
  toggleIsImageGeneration: () => void;
  exteraOptions: ExtraOptions;
  setExtraOptions: <K extends keyof ExtraOptions>(
    key: K,
    value: ExtraOptions[K]
  ) => void;
  prompt: string;
  setPrompt: (value: string) => void;
  modelIdx: number;
  setModelIdx: (modelIdx: number) => void;
  files: File[];
  addFile: (value: File) => void;
  removeFile: (id: number) => void;
  resetFiles: () => void;
  resetConversation: () => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
  conversation: undefined,
  setConversation: (conversation: Conversation) =>
    set((state) => ({ conversation: conversation })),
  isTemporary: false,
  toggleIsTemporary: () =>
    set((state) => ({ isTemporary: !state.isTemporary })),
  isWebSearch: false,
  toggleIsWebSearch: () =>
    set((state) => ({
      isWebSearch: !state.isWebSearch,
      isReasoning: false,
      isImageGeneration: false,
      exteraOptions: {
        reasoningEffort: null,
        imageSize: null,
        imageQuality: null,
      },
      modelIdx: !state.isWebSearch
        ? textModels.findIndex((model) => model.canWebSearch)
        : 0,
    })),
  isReasoning: false,
  toggleIsReasoning: () =>
    set((state) => ({
      isWebSearch: false,
      isReasoning: !state.isReasoning,
      isImageGeneration: false,
      exteraOptions: {
        reasoningEffort: reasoningEffortOptions[1],
        imageSize: null,
        imageQuality: null,
      },
      modelIdx: !state.isReasoning
        ? textModels.findIndex((model) => model.canReasoning)
        : 0,
    })),
  isImageGeneration: false,
  toggleIsImageGeneration: () =>
    set((state) => ({
      isWebSearch: false,
      isReasoning: false,
      isImageGeneration: !state.isImageGeneration,
      exteraOptions: {
        reasoningEffort: null,
        imageSize: imageSizes[0],
        imageQuality: imageQualities[1],
      },
      modelIdx: 0,
    })),
  prompt: "",
  setPrompt: (value: string) => set((state) => ({ prompt: value })),
  modelIdx: 0,
  setModelIdx: (modelIdx: number) =>
    set((state) => ({
      ...(!state.isReasoning &&
        textModels[modelIdx].canReasoning && {
          isReasoning: true,
          exteraOptions: {
            reasoningEffort: reasoningEffortOptions[1],
            imageSize: null,
            imageQuality: null,
          },
        }),
      modelIdx: modelIdx,
    })),
  exteraOptions: { reasoningEffort: null, imageSize: null, imageQuality: null },
  setExtraOptions: <K extends keyof ExtraOptions>(
    key: K,
    value: ExtraOptions[K]
  ) => {
    set((state) => ({
      exteraOptions: { ...state.exteraOptions, [key]: value },
    }));
  },
  files: [],
  addFile: (value: File) =>
    set((state) => ({ files: [...state.files, value] })),
  removeFile: (id: number) =>
    set((state) => ({ files: state.files.filter((file) => file.id !== id) })),
  resetFiles: () => set((state) => ({ files: [] })),
  resetConversation: () =>
    set((state) => ({
      conversation: undefined,
      isTemporary: false,
      isSearch: false,
      isReasoning: false,
      isImageGeneration: false,
      exteraOptions: {
        reasoningEffort: null,
        imageSize: null,
        imageQuality: null,
      },
      prompt: "",
      modelIdx: 0,
      files: [],
    })),
}));
