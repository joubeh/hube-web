"use client";

import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
} from "@heroui/drawer";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { useConversationStore } from "@/store/chatgpt";
import { Conversation } from "@/types/chatgpt";

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  conversations,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  conversations: Conversation[];
}) {
  const router = useRouter();
  const { resetConversation, conversation } = useConversationStore();

  return (
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
                        if (conversation && conversation.id === c.id) {
                          onClose();
                          return;
                        }
                        resetConversation();
                        router.push(`/chatgpt/c/${c.id}`);
                        onClose();
                      }}
                      fullWidth
                      key={c.id}
                      variant={
                        conversation && conversation.id === c.id
                          ? "solid"
                          : "light"
                      }
                      color="default"
                      size="sm"
                      dir="auto"
                      className="justify-start"
                    >
                      {c.title}
                    </Button>
                  ))}
                </div>
              ) : (
                <div>هیچ گفتگویی موجود نیست</div>
              )}
            </DrawerBody>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
