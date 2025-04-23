"use client";

import React, { useRef, useState, useEffect, use } from "react";
import {
  PiChatCircleSlash,
  PiNotePencil,
  PiMicrophone,
  PiWaveformBold,
  PiPlus,
  PiLightbulb,
  PiCaretDown,
  PiCheckCircle,
  PiArrowUpBold,
  PiList,
  PiHouse,
  PiGlobe,
} from "react-icons/pi";
import { useDisclosure } from "@heroui/use-disclosure";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@heroui/drawer";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

const models = [
  {
    name: "ChatGPT-4o",
    description: "برای اکثر سوالات عالی است",
    model: "gpt-4o",
  },
  {
    name: "ChatGPT-4o mini",
    description: "عالی برای کارهای روزمره",
    model: "gpt-4o-mini",
  },
  {
    name: "ChatGPT-4.5",
    description: "برای نوشتن و بررسی ایده ها خوب است",
    model: "gpt-4o",
  },
];

type Params = Promise<{ id?: string }>;
type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};
export default function Chatgpt(props: { params: Params }) {
  const params = use(props.params);
  const { id } = params;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const [conversationId, setConversationId] = useState(
    id ? parseInt(id) : null
  );
  const [selectedModel, setSelectedModel] = useState(models[0].name);
  const [isTemporary, setIsTemporary] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [isReasoning, setIsReasoning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [processingMessage, setProcessingMessage] = useState<string>("");

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height
      textarea.style.height = textarea.scrollHeight + "px"; // Set to scrollHeight
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [text]);

  async function sendMessage(cId: number | null, prompt: string) {
    if (!cId) return;
    let model = "gpt-4o";
    models.forEach((m) => {
      if (m.name === selectedModel) model = m.model;
    });

    setMessages((state) => [
      ...state,
      {
        id: Date.now(),
        role: "user",
        content: prompt,
      },
    ]);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chatgpt/conversation/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            prompt: prompt,
            model: model,
            conversationId: cId,
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
            role: "assistant",
            content: fullResponse,
          },
        ]);
        setProcessingMessage("");
      }
    } catch (err) {
      console.log("something went wrong");
      console.log(err);
    }
  }

  async function handleSubmit() {
    if (isLoading) return;
    if (text.trim()) {
      setIsLoading(true);
      const prompt = text;
      setText("");
      if (!conversationId) {
        const response = await api("/chatgpt/conversation/start", "POST", {
          isTemporary: isTemporary,
        });
        if (response.ok) {
          setConversationId(response.data.id);
          await sendMessage(response.data.id, prompt);
        }
        setIsLoading(false);
        return;
      }

      await sendMessage(conversationId, prompt);
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex md:hidden items-center justify-between p-2 px-3">
        <Button
          onPress={onOpen}
          isIconOnly
          radius="lg"
          color="default"
          variant="light"
        >
          <PiList className="text-2xl" />
        </Button>

        <Dropdown>
          <DropdownTrigger>
            <Button
              radius="lg"
              color="default"
              variant="light"
              className="text-lg gap-1"
              startContent={<PiCaretDown className="text-sm" />}
            >
              {selectedModel}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            variant="faded"
            onAction={(key) => setSelectedModel(key.toString())}
          >
            {models.map((m) => (
              <DropdownItem
                key={m.name}
                description={m.description}
                endContent={
                  selectedModel === m.name ? (
                    <PiCheckCircle className="text-xl text-default-800 pointer-events-none flex-shrink-0" />
                  ) : null
                }
              >
                {m.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>

        <div className="flex items-center justify-center gap-1">
          <Button
            onPress={(e) => setIsTemporary((s) => !s)}
            radius="full"
            color={isTemporary ? "primary" : "default"}
            variant={isTemporary ? "flat" : "bordered"}
            size="sm"
            isIconOnly
          >
            <PiChatCircleSlash className="text-lg" />
          </Button>
          <Button
            onPress={(e) => router.push("/")}
            radius="full"
            color={"default"}
            variant={"bordered"}
            size="sm"
            isIconOnly
          >
            <PiHouse className="text-lg" />
          </Button>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-between p-2 px-3">
        <div className="flex items-start justify-center text-gray-700">
          <Button
            onPress={onOpen}
            isIconOnly
            radius="lg"
            color="default"
            variant="light"
          >
            <PiList className="text-2xl" />
          </Button>
          <Button isIconOnly radius="lg" color="default" variant="light">
            <PiNotePencil className="text-2xl" />
          </Button>

          <Dropdown>
            <DropdownTrigger>
              <Button
                radius="lg"
                color="default"
                variant="light"
                className="text-lg gap-1"
                startContent={<PiCaretDown className="text-sm" />}
              >
                {selectedModel}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              variant="faded"
              onAction={(key) => setSelectedModel(key.toString())}
            >
              {models.map((m) => (
                <DropdownItem
                  key={m.name}
                  description={m.description}
                  endContent={
                    selectedModel === m.name ? (
                      <PiCheckCircle className="text-xl text-default-800 pointer-events-none flex-shrink-0" />
                    ) : null
                  }
                >
                  {m.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="flex items-center justify-center gap-1">
          <Button
            onPress={(e) => setIsTemporary((s) => !s)}
            radius="full"
            color={isTemporary ? "primary" : "default"}
            variant={isTemporary ? "flat" : "bordered"}
            size="sm"
            className="gap-1"
            startContent={<PiChatCircleSlash className="text-lg" />}
          >
            گفتگو موقت
          </Button>
          <Button
            onPress={(e) => router.push("/")}
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
      </div>

      <div
        className={`flex flex-col gap-4 items-center ${
          conversationId
            ? "justify-between"
            : "justify-between md:justify-start"
        } p-2 flex-1`}
      >
        {conversationId ? (
          <div className="flex flex-col gap-4 w-full md:max-w-[45rem]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={m.role === "user" ? "flex justify-start" : ""}
              >
                <div
                  className={
                    m.role === "user"
                      ? "bg-gray-100 py-3 px-4 rounded-full"
                      : ""
                  }
                  dir="auto"
                >
                  {m.content}
                </div>
              </div>
            ))}
            {processingMessage && <div>{processingMessage}</div>}
          </div>
        ) : (
          <div className="text-2xl pt-[10rem] font-bold">
            چه کمکی میتونم بکنم؟
          </div>
        )}
        <div className="w-full md:max-w-[45rem]">
          <div className="px-4 py-3 shadow md:shadow-lg rounded-3xl border border-gray-300 w-full">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={1}
              className="px-1 pt-1 pb-2 md:px-2"
              style={{
                width: "100%",
                resize: "none",
                overflow: "hidden",
                lineHeight: "1.5",
                outline: "none",
                border: "none",
              }}
              dir={text ? "auto" : "rtl"}
              placeholder="هرچی میخوای بپرس"
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center justify-cneter text-sm gap-1">
                <Button
                  isIconOnly
                  radius="full"
                  color="default"
                  variant="bordered"
                  size="sm"
                >
                  <PiPlus className="text-lg" />
                </Button>

                <div className="hidden md:block">
                  <Button
                    onPress={(e) => setIsSearch((s) => !s)}
                    radius="full"
                    color={isSearch ? "primary" : "default"}
                    variant={isSearch ? "flat" : "bordered"}
                    size="sm"
                    className="gap-1"
                    startContent={<PiGlobe className="text-lg" />}
                  >
                    جستجو وب
                  </Button>
                </div>
                <div className="hidden md:block">
                  <Button
                    onPress={(e) => setIsReasoning((s) => !s)}
                    radius="full"
                    color={isReasoning ? "primary" : "default"}
                    variant={isReasoning ? "flat" : "bordered"}
                    size="sm"
                    className="gap-1"
                    startContent={<PiLightbulb className="text-lg" />}
                  >
                    تفکر عمیق
                  </Button>
                </div>
                <div className="block md:hidden">
                  <Button
                    onPress={(e) => setIsSearch((s) => !s)}
                    isIconOnly
                    radius="full"
                    color={isSearch ? "primary" : "default"}
                    variant={isSearch ? "flat" : "bordered"}
                    size="sm"
                  >
                    <PiGlobe className="text-lg" />
                  </Button>
                </div>
                <div className="block md:hidden">
                  <Button
                    onPress={(e) => setIsSearch((s) => !s)}
                    isIconOnly
                    radius="full"
                    color={isSearch ? "primary" : "default"}
                    variant={isSearch ? "flat" : "bordered"}
                    size="sm"
                  >
                    <PiLightbulb className="text-lg" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-cneter gap-1">
                <Button
                  isIconOnly
                  radius="full"
                  color="default"
                  variant="bordered"
                  size="sm"
                >
                  <PiMicrophone className="text-lg" />
                </Button>
                <Button
                  isIconOnly
                  radius="full"
                  color="default"
                  size="sm"
                  className="bg-black text-white"
                  isLoading={isLoading}
                  onPress={handleSubmit}
                >
                  {text ? (
                    <PiArrowUpBold className="text-lg" />
                  ) : (
                    <PiWaveformBold className="text-lg" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          {conversationId && (
            <div className="text-gray-700 text-xs text-center mt-1 md:mt-2">
              چت جی پی تی ممکن است اشتباه کند. اطلاعات مهم را بررسی کنید.
            </div>
          )}
        </div>
      </div>

      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="right"
        backdrop="blur"
        size="xs"
        radius="none"
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                Drawer Title
              </DrawerHeader>
              <DrawerBody>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Magna exercitation reprehenderit magna aute tempor cupidatat
                  consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex
                  incididunt cillum quis. Velit duis sit officia eiusmod Lorem
                  aliqua enim laboris do dolor eiusmod. Et mollit incididunt
                  nisi consectetur esse laborum eiusmod pariatur proident Lorem
                  eiusmod et. Culpa deserunt nostrud ad veniam.
                </p>
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
