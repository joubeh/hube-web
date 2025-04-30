"use client";

import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
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
  const { resetConversation } = useConversationStore();

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
  );
}
