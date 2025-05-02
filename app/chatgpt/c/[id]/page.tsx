"use client";

import React, { useRef, useState, useEffect, use } from "react";
import { useConversationStore } from "@/store/chatgpt";
import { Message } from "@/types/chatgpt";
import { Spinner } from "@heroui/spinner";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import TextInputBar from "@/components/chatgpt/TextInput‌Bar";
import MessagesContainer from "@/components/chatgpt/MessagesContainer";
import Sidebar from "@/components/chatgpt/Sidebar";
import { Conversation } from "@/types/chatgpt";
import MainHeader from "@/components/chatgpt/MainHeader";
import { Button } from "@heroui/button";
import { PiCopy } from "react-icons/pi";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import copy from "@/lib/copy";
import { textModels } from "@/lib/chatgpt/models";

type Params = Promise<{ id: string }>;
export default function ConversationPage(props: { params: Params }) {
  const params = use(props.params);
  const { id } = params;
  const {
    prompt,
    setPrompt,
    conversation,
    setConversation,
    modelIdx,
    isTemporary,
    isSearch,
    isReasoning,
  } = useConversationStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(true);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [processingMessage, setProcessingMessage] = useState<string>("");
  const router = useRouter();
  const hasFetchedData = useRef<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isShareLoading, setIsShareLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  async function loadConversations() {
    const response = await api("/chatgpt/conversations", "GET");
    if (response.ok) {
      setConversations(response.data.conversations);
    }
  }

  async function sendMessage(inputText: string) {
    if (!conversation) return;
    if (isLoading) return;
    setIsLoading(true);
    const newMessages = messages;
    newMessages.push({
      id: Date.now(),
      conversationId: conversation.id,
      model: textModels[modelIdx].model,
      role: "user",
      content: inputText,
      useWebSearch: isSearch,
      useReasoning: isReasoning,
      reasoningEffort: isReasoning ? "medium" : null,
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
            model: textModels[modelIdx].model,
            useWebSearch: isSearch,
            useReasoning: isReasoning,
            reasoningEffort: isReasoning ? "medium" : null,
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
          model: textModels[modelIdx].model,
          role: "assistant",
          content: fullResponse,
          useWebSearch: isSearch,
          useReasoning: isReasoning,
          reasoningEffort: isReasoning ? "medium" : null,
        });
        setMessages(newMessages);
        setProcessingMessage("");
      }
    } catch (err) {
      console.log("something went wrong");
      console.log(err);
    }
    setIsLoading(false);
    if (conversations.length === 0) {
      loadConversations();
    }
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

  async function shareConversation() {
    if (isShareLoading || !conversation) return;

    setIsShareLoading(true);
    const response = await api(
      `/chatgpt/conversation/${conversation.id}/share`,
      "POST"
    );

    if (response.ok && conversation) {
      setConversation({
        ...conversation,
        isPublic: true,
      });
    }
    setIsShareLoading(false);
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
    <div className="flex flex-col min-h-screen relative">
      <MainHeader
        setIsSidebarOpen={setIsSidebarOpen}
        setIsShareModalOpen={setIsShareModalOpen}
      />
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
            {isOwner && (
              <TextInputBar onSubmit={sendMessage} isLoading={isLoading} />
            )}
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

      {conversation && !isTemporary && (
        <Modal
          isOpen={isShareModalOpen}
          onOpenChange={setIsShareModalOpen}
          backdrop="blur"
          isDismissable={!isShareLoading}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  اشتراک گذاری گفتگو
                </ModalHeader>
                <ModalBody>
                  {conversation.isPublic ? (
                    <div className="pb-2 text-lg">
                      <div className="flex items-center flex-wrap gap-2 mb-3">
                        <Button
                          isIconOnly
                          color="primary"
                          variant="faded"
                          size="sm"
                          radius="full"
                          onPress={(e) =>
                            copy(
                              `${process.env.NEXT_PUBLIC_APP_URL}/chatgpt/c/${conversation.id}`
                            )
                          }
                        >
                          <PiCopy />
                        </Button>
                        <div>لینک گتفگو</div>
                      </div>

                      <div className="text-blue-700" dir="ltr">
                        <code>{`${process.env.NEXT_PUBLIC_APP_URL}/chatgpt/c/${conversation.id}`}</code>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm">
                      <p>
                        این گفتگو خصوصی است و فقط شما به آن دسترسی دارید. اگر
                        تمایل داشته باشید میتوانید آن را با دوستانتان به اشتراک
                        بگذارید.
                      </p>
                      <div className="flex items-center justify-center gap-1 py-2">
                        <Button
                          color="primary"
                          fullWidth
                          isLoading={isShareLoading}
                          onPress={shareConversation}
                          size="sm"
                        >
                          اشتراک گذاری
                        </Button>
                        {!isShareLoading && (
                          <Button
                            color="danger"
                            variant="light"
                            fullWidth
                            onPress={onClose}
                            size="sm"
                          >
                            انصراف
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      )}

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        conversations={conversations}
      />
    </div>
  );
}
