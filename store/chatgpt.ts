import { Conversation } from "@/types/chatgpt";
import { create } from "zustand";
import { models } from "@/lib/chatgpt/models";

interface ConversationState {
  conversation?: Conversation;
  setConversation: (conversation: Conversation) => void;
  isTemporary: boolean;
  toggleIsTemporary: () => void;
  isSearch: boolean;
  toggleIsSearch: () => void;
  isReasoning: boolean;
  toggleIsReasoning: () => void;
  isImageGeneration: boolean;
  toggleIsImageGeneration: () => void;
  prompt: string;
  setPrompt: (value: string) => void;
  modelIdx: number;
  setModelIdx: (modelIdx: number) => void;
  resetConversation: () => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
  conversation: undefined,
  setConversation: (conversation: Conversation) =>
    set((state) => ({ conversation: conversation })),
  isTemporary: false,
  toggleIsTemporary: () =>
    set((state) => ({ isTemporary: !state.isTemporary })),
  isSearch: false,
  toggleIsSearch: () =>
    set((state) => {
      let newState = {
        isSearch: !state.isSearch,
        modelIdx: state.modelIdx,
        isReasoning: state.isReasoning,
        isImageGeneration: state.isImageGeneration,
      };
      if (!state.isSearch) {
        newState.modelIdx = models.findIndex((model) => model.canWebSearch);
        if (!models[newState.modelIdx].canReasoning)
          newState.isReasoning = false;
        if (!models[newState.modelIdx].canGenerateImage)
          newState.isImageGeneration = false;
      }
      return newState;
    }),
  isReasoning: false,
  toggleIsReasoning: () =>
    set((state) => {
      let newState = {
        isReasoning: !state.isReasoning,
        modelIdx: state.modelIdx,
        isSearch: state.isSearch,
        isImageGeneration: state.isImageGeneration,
      };
      if (!state.isReasoning) {
        newState.modelIdx = models.findIndex((model) => model.canReasoning);
        if (!models[newState.modelIdx].canWebSearch) newState.isSearch = false;
        if (!models[newState.modelIdx].canGenerateImage)
          newState.isImageGeneration = false;
      }
      return newState;
    }),
  isImageGeneration: false,
  toggleIsImageGeneration: () =>
    set((state) => {
      let newState = {
        isImageGeneration: !state.isImageGeneration,
        modelIdx: state.modelIdx,
        isSearch: state.isSearch,
        isReasoning: state.isReasoning,
      };
      if (!state.isImageGeneration) {
        newState.modelIdx = models.findIndex((model) => model.canGenerateImage);
        if (!models[newState.modelIdx].canWebSearch) newState.isSearch = false;
        if (!models[newState.modelIdx].canReasoning)
          newState.isReasoning = false;
      }
      return newState;
    }),
  prompt: "",
  setPrompt: (value: string) => set((state) => ({ prompt: value })),
  modelIdx: 0,
  setModelIdx: (modelIdx: number) =>
    set((state) => ({
      modelIdx: modelIdx,
    })),
  resetConversation: () =>
    set((state) => ({
      conversation: undefined,
      isTemporary: false,
      isSearch: false,
      isReasoning: false,
      isImageGeneration: false,
      prompt: "",
      modelIdx: 0,
    })),
}));
