import { Conversation } from "@/types/chatgpt";
import { create } from "zustand";
import { textModels } from "@/lib/chatgpt/models";

interface ConversationState {
  conversation?: Conversation;
  setConversation: (conversation: Conversation) => void;
  isTemporary: boolean;
  toggleIsTemporary: () => void;
  isSearch: boolean;
  toggleIsSearch: () => void;
  isReasoning: boolean;
  toggleIsReasoning: () => void;
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
      };
      if (!state.isSearch) {
        newState.modelIdx = textModels.findIndex((model) => model.canWebSearch);
        if (!textModels[newState.modelIdx].canReasoning)
          newState.isReasoning = false;
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
      };
      if (!state.isReasoning) {
        newState.modelIdx = textModels.findIndex((model) => model.canReasoning);
        if (!textModels[newState.modelIdx].canWebSearch)
          newState.isSearch = false;
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
      prompt: "",
      modelIdx: 0,
    })),
}));
