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
import { addToast } from "@heroui/toast";

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
    isWebSearch,
    isReasoning,
    isImageGeneration,
    exteraOptions,
    files,
    resetFiles,
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
  const [imageLoading, setImageLoading] = useState(false);
  const statusIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  async function checkImageStatus(id: number) {
    const response = await api(`/chatgpt/message/${id}`, "GET");
    if (response.ok) {
      if (response.data.status === 404) {
        addToast({
          title: "خطا",
          description:
            "خطایی پیش آمده و عکس تولید نشد. لطفا دوباره در زمانی دیگر امتحان کنید.",
          color: "danger",
        });
        setImageLoading(false);
        clearInterval(statusIntervalRef.current!);
        setIsLoading(false);
        const newMessages = messages;
        newMessages.pop();
        setMessages(newMessages);
        return;
      }

      const message = response.data.message;
      if (message.isDone) {
        setImageLoading(false);
        clearInterval(statusIntervalRef.current!);
        setIsLoading(false);
        setMessages([
          ...messages,
          {
            id: Date.now(),
            conversationId: conversation!.id,
            model: "dall-e-3",
            role: "assistant",
            content: message.content,
            useWebSearch: message.isWebSearch,
            useReasoning: message.isReasoning,
            reasoningEffort: message.reasoningEffort,
            imageSize: message.imageSize,
            imageQuality: message.imageQuality,
            type: "image",
            files: [],
          },
        ]);
      }
    }
  }

  async function generateImage(inputText: string) {
    if (!conversation) return;
    if (isLoading) return;
    setIsLoading(true);
    setImageLoading(false);
    if (statusIntervalRef.current) {
      clearInterval(statusIntervalRef.current);
    }
    statusIntervalRef.current = null;
    const response = await api(
      `/chatgpt/conversation/${conversation.id}/image/generate`,
      "POST",
      {
        prompt: inputText,
        size: exteraOptions.imageSize,
        quality: exteraOptions.imageQuality,
      }
    );

    if (response.ok) {
      const newMessages = messages;
      newMessages.push({
        id: Date.now(),
        conversationId: conversation.id,
        model: "dall-e-3",
        role: "user",
        content: inputText,
        useWebSearch: isWebSearch,
        useReasoning: isReasoning,
        reasoningEffort: isReasoning ? exteraOptions.reasoningEffort : null,
        imageSize: exteraOptions.imageSize,
        imageQuality: exteraOptions.imageQuality,
        type: "text",
        files: [],
      });
      setMessages(newMessages);
      setImageLoading(true);
      statusIntervalRef.current = setInterval(() => {
        checkImageStatus(response.data.id);
      }, 5000);
    } else {
      setIsLoading(false);
    }
  }

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
    setMessages((state) => [
      ...state,
      {
        id: Date.now(),
        conversationId: conversation.id,
        model: textModels[modelIdx].model,
        role: "user",
        content: inputText,
        useWebSearch: isWebSearch,
        useReasoning: isReasoning,
        reasoningEffort: isReasoning ? exteraOptions.reasoningEffort : null,
        imageSize: exteraOptions.imageSize,
        imageQuality: exteraOptions.imageQuality,
        type: "text",
        files: files.length > 0 ? files : [],
      },
    ]);

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
            useWebSearch: isWebSearch,
            useReasoning: isReasoning,
            reasoningEffort: isReasoning ? exteraOptions.reasoningEffort : null,
            ...(files.length > 0 && { files: files.map((f) => f.id) }),
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
        setMessages((state) => [
          ...state,
          {
            id: Date.now(),
            conversationId: conversation.id,
            model: textModels[modelIdx].model,
            role: "assistant",
            content: fullResponse,
            useWebSearch: isWebSearch,
            useReasoning: isReasoning,
            reasoningEffort: isReasoning ? exteraOptions.reasoningEffort : null,
            imageSize: exteraOptions.imageSize,
            imageQuality: exteraOptions.imageQuality,
            type: "text",
            files: [],
          },
        ]);
        setProcessingMessage("");
      }
    } catch (err) {
      console.log("something went wrong");
      console.log(err);
    }
    resetFiles();
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
      console.log(response.data.files);
      const msgArr = response.data.messages.map((msg: Message) => ({
        ...msg,
        files: [] as File[],
      }));

      for (let i = 0; i < response.data.files.length; i++) {
        for (let j = 0; j < msgArr.length; j++) {
          if (response.data.files[i].messageId === msgArr[j].id) {
            msgArr[j].files.push(response.data.files[i]);
            break;
          }
        }
      }
      console.log(msgArr);

      setIsOwner(response.data.isOwner);
      setMessages(msgArr);
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
      if (isImageGeneration) {
        generateImage(inputText);
      } else {
        sendMessage(inputText);
      }
      setPrompt("");
    } else {
      initConversation();
      loadConversations();
    }
  }, [conversation, initConversation, setPrompt]);

  useEffect(() => {
    if (messages.length && messages[messages.length - 1].role === "user") {
      endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
      <div className="flex flex-col gap-4 items-center justify-between pt-[3.5rem] px-0 flex-1">
        <MessagesContainer
          messages={messages}
          processingMessage={processingMessage}
          isOwner={isOwner}
          imageLoading={imageLoading}
        />
        <div className={isOwner ? "pb-[15rem]" : "pb-[3rem]"} />
        <div ref={endOfMessagesRef} />

        <div className="w-full fixed bottom-0 right-0 bg-background p-2 z-50">
          <div className="w-full md:max-w-[45rem] mx-auto">
            {isOwner && (
              <TextInputBar
                setIsLoading={setIsLoading}
                onSubmit={isImageGeneration ? generateImage : sendMessage}
                isLoading={isLoading}
                showImageGenerationAlert={true}
              />
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
