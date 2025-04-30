"use client";

import React, { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@heroui/drawer";
import { Button } from "@heroui/button";
import { useConversationStore } from "@/store/chatgpt";
import { Conversation } from "@/types/chatgpt";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  PiChatCircleSlash,
  PiCheckCircle,
  PiList,
  PiHouse,
  PiNotePencil,
  PiRobot,
  PiShareFat,
  PiCopy,
} from "react-icons/pi";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import copy from "@/lib/copy";
import { textModels, imageGenerationModels } from "@/lib/chatgpt/models";

export default function ChatgptLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    conversation,
    setConversation,
    modelIdx,
    setModelIdx,
    isTemporary,
    toggleIsTemporary,
    resetConversation,
    isImageGeneration,
    isReasoning,
    isSearch,
  } = useConversationStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isShareLoading, setIsShareLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const router = useRouter();

  async function loadConversations() {
    const response = await api("/chatgpt/conversations", "GET");
    if (response.ok) {
      setConversations(response.data.conversations);
    }
  }

  function newConversation() {
    resetConversation();
    router.push("/chatgpt");
  }

  function backToHome() {
    resetConversation();
    router.push("/");
  }

  useEffect(() => {
    loadConversations();
  }, []);

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

  return (
    <div className="flex flex-col min-h-screen relative">
      <div
        className={`flex items-center justify-between text-gray-700 gap-1 p-2 px-3 bg-background fixed top-0 right-0 w-full border-gray-300 ${
          conversation && "border-b"
        } z-50`}
      >
        <div className="flex items-center gap-1">
          <Button
            onPress={(e) => setIsSidebarOpen(true)}
            isIconOnly
            radius="full"
            color={"default"}
            variant={"bordered"}
            size="sm"
            className="gap-1"
          >
            <PiList className="text-lg" />
          </Button>
          <div className="block md:hidden">
            <Button
              onPress={backToHome}
              isIconOnly
              radius="full"
              color={"default"}
              variant={"bordered"}
              size="sm"
              className="gap-1"
            >
              <PiHouse className="text-lg" />
            </Button>
          </div>
          <div className="hidden md:block">
            <Button
              onPress={backToHome}
              radius="full"
              color={"default"}
              variant={"bordered"}
              size="sm"
              className="gap-1"
              startContent={<PiHouse className="text-lg" />}
            >
              خانه
            </Button>
          </div>
          {conversation ? (
            <>
              <div className="block md:hidden">
                <Button
                  onPress={newConversation}
                  isIconOnly
                  radius="full"
                  color={"default"}
                  variant={"bordered"}
                  size="sm"
                  className="gap-1"
                >
                  <PiNotePencil className="text-lg" />
                </Button>
              </div>
              <div className="hidden md:block">
                <Button
                  onPress={newConversation}
                  radius="full"
                  color={"default"}
                  variant={"bordered"}
                  size="sm"
                  className="gap-1"
                  startContent={<PiNotePencil className="text-lg" />}
                >
                  گفتگو جدید
                </Button>
              </div>

              {!isTemporary && (
                <>
                  <div className="block md:hidden">
                    <Button
                      onPress={(e) => setIsShareModalOpen(true)}
                      isIconOnly
                      radius="full"
                      color={"default"}
                      variant={"bordered"}
                      size="sm"
                      className="gap-1"
                    >
                      <PiShareFat className="text-lg" />
                    </Button>
                  </div>
                  <div className="hidden md:block">
                    <Button
                      onPress={(e) => setIsShareModalOpen(true)}
                      radius="full"
                      color={"default"}
                      variant={"bordered"}
                      size="sm"
                      className="gap-1"
                      startContent={<PiShareFat className="text-lg" />}
                    >
                      اشتراک گذاری
                    </Button>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div className="block md:hidden">
                <Button
                  onPress={toggleIsTemporary}
                  isIconOnly
                  radius="full"
                  color={isTemporary ? "primary" : "default"}
                  variant={isTemporary ? "flat" : "bordered"}
                  size="sm"
                  className="gap-1"
                >
                  <PiChatCircleSlash className="text-lg" />
                </Button>
              </div>
              <div className="hidden md:block">
                <Button
                  onPress={toggleIsTemporary}
                  radius="full"
                  color={isTemporary ? "primary" : "default"}
                  variant={isTemporary ? "flat" : "bordered"}
                  size="sm"
                  className="gap-1"
                  startContent={<PiChatCircleSlash className="text-lg" />}
                >
                  گفتگو موقت
                </Button>
              </div>
            </>
          )}
        </div>

        <Dropdown>
          <DropdownTrigger>
            <Button
              radius="full"
              color={"default"}
              variant={"bordered"}
              size="sm"
              className="gap-1"
              startContent={<PiRobot className="text-lg" />}
            >
              {models[modelIdx].name}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            variant="faded"
            onAction={(key) => setModelIdx(parseInt(key.toString()))}
          >
            {models.map((m, idx) => {
              if (!isImageGeneration && m.canGenerateImage) return null;
              if (isImageGeneration && !m.canGenerateImage) return null;
              if (isReasoning && !m.canGenerateImage) return null;
              if (isSearch && !m.canWebSearch) return null;

              return (
                <DropdownItem
                  key={idx}
                  description={m.description}
                  endContent={
                    modelIdx === idx ? (
                      <PiCheckCircle className="text-xl text-default-800 pointer-events-none flex-shrink-0" />
                    ) : null
                  }
                >
                  {m.name}
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        </Dropdown>
      </div>

      {children}

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
                              `${process.env.NEXT_PUBLIC_APP_URL}/chatgpt/${conversation.id}`
                            )
                          }
                        >
                          <PiCopy />
                        </Button>
                        <div>لینک گتفگو</div>
                      </div>

                      <div className="text-blue-700" dir="ltr">
                        <code>{`${process.env.NEXT_PUBLIC_APP_URL}/chatgpt/${conversation.id}`}</code>
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

      <Drawer
        isOpen={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
        placement="right"
        backdrop="blur"
        size="xs"
        radius="none"
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                گفتگوهای پیشین
              </DrawerHeader>
              <DrawerBody>
                {conversations.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    {conversations.map((c) => (
                      <Button
                        onPress={(e) => {
                          resetConversation();
                          router.push(`/chatgpt/${c.id}`);
                          onClose();
                        }}
                        fullWidth
                        key={c.id}
                        variant="flat"
                        color="primary"
                        size="sm"
                      >
                        {c.title}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div>هیچ گفتگویی موجود نیست</div>
                )}
              </DrawerBody>
              <DrawerFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
