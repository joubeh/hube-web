"use client";

import React, { useRef, useState, useEffect, use } from "react";
import { useConversationStore } from "@/store/chatgpt";
import { Message } from "@/types/chatgpt";
import { Spinner } from "@heroui/spinner";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import InputBar from "@/components/chatgpt/Input‌Bar";
import MessagesContainer from "@/components/chatgpt/MessagesContainer";
import { models } from "@/lib/chatgpt/models";

type Params = Promise<{ id: string }>;
export default function ConversationPage(props: { params: Params }) {
  const params = use(props.params);
  const { id } = params;
  const { prompt, setPrompt, conversation, setConversation, modelIdx } =
    useConversationStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(true);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [processingMessage, setProcessingMessage] = useState<string>("");
  const router = useRouter();
  const hasFetchedData = useRef<boolean>(false);

  async function sendMessage(inputText: string) {
    if (!conversation) return;
    if (isLoading) return;
    setIsLoading(true);
    const newMessages = messages;
    newMessages.push({
      id: Date.now(),
      conversationId: conversation.id,
      model: models[modelIdx].name,
      type: "text",
      role: "user",
      content: inputText,
    });
    setMessages(newMessages);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chatgpt/conversation/${conversation.id}/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            prompt: inputText,
            model: models[modelIdx].name,
          }),
        }
      );

      const reader = res.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      if (reader) {
        let fullResponse = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          fullResponse += chunk;
          setProcessingMessage((state) => state + chunk);
        }

        newMessages.push({
          id: Date.now(),
          conversationId: conversation.id,
          model: models[modelIdx].name,
          type: "text",
          role: "assistant",
          content: fullResponse,
        });
        setMessages(newMessages);
        setProcessingMessage("");
      }
    } catch (err) {
      console.log("something went wrong");
      console.log(err);
    }
    setIsLoading(false);
  }

  async function initConversation() {
    if (isPageLoading) return;
    setIsPageLoading(true);
    const response = await api(`/chatgpt/conversation/${id}`, "GET");
    if (response.ok) {
      setIsOwner(response.data.isOwner);
      setMessages(response.data.messages);
      setConversation(response.data.conversation);
    } else {
      router.push("/chatgpt");
    }
    setIsPageLoading(false);
  }

  useEffect(() => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;
    if (conversation) {
      setIsPageLoading(false);
      const inputText: string = prompt;
      sendMessage(inputText);
      setPrompt("");
    } else {
      initConversation();
    }
  }, [conversation, initConversation, setPrompt]);

  if (isPageLoading || !conversation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col gap-4 items-center justify-between pt-[3.5rem] ${
        isOwner ? "pb-[10rem]" : "pb-[3rem]"
      } px-0 flex-1`}
    >
      <MessagesContainer
        messages={messages}
        processingMessage={processingMessage}
        isOwner={isOwner}
      />

      <div className="w-full fixed bottom-0 right-0 bg-background p-2 z-50">
        <div className="w-full md:max-w-[45rem] mx-auto">
          {isOwner && <InputBar onSubmit={sendMessage} isLoading={isLoading} />}
          <div
            className={`text-gray-700 text-xs text-center ${
              isOwner && "mt-1 md:mt-2"
            }`}
          >
            چت جی پی تی ممکن است اشتباه کند. اطلاعات مهم را بررسی کنید.
          </div>
        </div>
      </div>
    </div>
  );
}
