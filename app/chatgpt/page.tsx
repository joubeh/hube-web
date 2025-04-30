"use client";

import { useState, useEffect } from "react";
import { useConversationStore } from "@/store/chatgpt";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import InputBar from "@/components/chatgpt/Input‌Bar";

export default function NewConversationPage() {
  const { isTemporary, setPrompt, conversation, setConversation } =
    useConversationStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

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
    if (conversation) {
      router.push(`/chatgpt/${conversation.id}`);
    }
  }, [conversation, router]);

  return (
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
          <InputBar onSubmit={createConversation} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
