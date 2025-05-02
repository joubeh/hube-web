"use client";

import React, { useState, useEffect } from "react";
import { useConversationStore } from "@/store/chatgpt";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import TextInputBar from "@/components/chatgpt/TextInput‌Bar";
import Sidebar from "@/components/chatgpt/Sidebar";
import { Conversation } from "@/types/chatgpt";
import MainHeader from "@/components/chatgpt/MainHeader";

export default function NewConversationPage() {
  const { isTemporary, setPrompt, conversation, setConversation } =
    useConversationStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  async function loadConversations() {
    const response = await api("/chatgpt/conversations", "GET");
    if (response.ok) {
      setConversations(response.data.conversations);
    }
  }

  async function createConversation(inputText: string) {
    if (isLoading) return;
    if (inputText.trim()) {
      setIsLoading(true);
      setPrompt(inputText);
      const response = await api("/chatgpt/conversation/create", "POST", {
        isTemporary: isTemporary,
      });
      if (response.ok) {
        setConversation(response.data.conversation);
        return;
      }
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (conversation) {
      router.push(`/chatgpt/c/${conversation.id}`);
    }
  }, [conversation, router]);

  return (
    <div className="flex flex-col min-h-screen relative">
      <MainHeader setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex flex-col gap-4 items-center justify-between md:justify-start px-0 flex-1">
        {isTemporary ? (
          <div className="pt-[14rem]">
            <div className="text-center text-2xl font-bold">
              چه کمکی میتونم بکنم؟
            </div>
            <div className="text-center mt-2 text-gray-700">
              این گفتگو موقتی است و ذخیره نمیشود
            </div>
          </div>
        ) : (
          <div className="text-2xl pt-[14rem] font-bold">
            چه کمکی میتونم بکنم؟
          </div>
        )}
        <div className={`w-full bg-background p-2`}>
          <div className="w-full md:max-w-[45rem] mx-auto">
            <TextInputBar onSubmit={createConversation} isLoading={isLoading} />
          </div>
        </div>
      </div>

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        conversations={conversations}
      />
    </div>
  );
}
