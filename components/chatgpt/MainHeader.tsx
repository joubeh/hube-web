"use client";

import React from "react";
import { Button } from "@heroui/button";
import { useConversationStore } from "@/store/chatgpt";
import { useRouter } from "next/navigation";
import {
  PiChatCircleSlash,
  PiCheckCircle,
  PiList,
  PiHouse,
  PiNotePencil,
  PiRobot,
  PiShareFat,
} from "react-icons/pi";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { textModels } from "@/lib/chatgpt/models";

export default function MainHeader({
  setIsSidebarOpen,
  setIsShareModalOpen,
}: {
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShareModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    conversation,
    modelIdx,
    setModelIdx,
    isTemporary,
    toggleIsTemporary,
    resetConversation,
    isReasoning,
    isSearch,
  } = useConversationStore();
  const router = useRouter();

  function newConversation() {
    resetConversation();
    router.push("/chatgpt");
  }

  function backToHome() {
    resetConversation();
    router.push("/");
  }

  return (
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

            {setIsShareModalOpen && !isTemporary && (
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
            {textModels[modelIdx].name}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          variant="faded"
          onAction={(key) => setModelIdx(parseInt(key.toString()))}
        >
          {textModels.map((m, idx) => {
            if (isReasoning && !m.canReasoning) return null;
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
  );
}
