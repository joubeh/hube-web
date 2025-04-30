"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@heroui/button";
import {
  PiWaveformBold,
  PiPlus,
  PiLightbulb,
  PiArrowUpBold,
  PiMicrophone,
  PiGlobeSimple,
  PiPaintBrush,
} from "react-icons/pi";
import { useConversationStore } from "@/store/chatgpt";
import { useRouter } from "next/navigation";

export default function TextInputBar({
  isLoading,
  onSubmit,
}: {
  isLoading: boolean;
  onSubmit: (inputText: string) => void;
}) {
  const [text, setText] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const {
    isTemporary,
    isSearch,
    toggleIsSearch,
    isReasoning,
    toggleIsReasoning,
    resetConversation,
  } = useConversationStore();
  const router = useRouter();

  function adjustHeight() {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height
      textarea.style.height = textarea.scrollHeight + "px"; // Set to scrollHeight
    }
  }

  useEffect(() => {
    adjustHeight();
  }, [text]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (text.trim()) {
      const input: string = text;
      onSubmit(input);
      setText("");
    }
  }

  function imageGeneration() {
    // resetConversation();
    // router.push("/chatgpt-image");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`px-4 py-3 shadow md:shadow-lg rounded-3xl border border-gray-300 w-full ${
        isTemporary && "bg-zinc-800 text-white dark"
      }`}
    >
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={1}
        className={`px-1 pt-1 pb-2 md:px-2 ${isTemporary && "bg-zinc-800"}`}
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
              onPress={toggleIsSearch}
              radius="full"
              color={isSearch ? "primary" : "default"}
              variant={isSearch ? "flat" : "bordered"}
              size="sm"
              className="gap-1"
              startContent={<PiGlobeSimple className="text-lg" />}
            >
              جستجو وب
            </Button>
          </div>
          <div className="block md:hidden">
            <Button
              onPress={toggleIsSearch}
              isIconOnly
              radius="full"
              color={isSearch ? "primary" : "default"}
              variant={isSearch ? "flat" : "bordered"}
              size="sm"
            >
              <PiGlobeSimple className="text-lg" />
            </Button>
          </div>

          <div className="hidden md:block">
            <Button
              onPress={toggleIsReasoning}
              radius="full"
              color={isReasoning ? "primary" : "default"}
              variant={isReasoning ? "flat" : "bordered"}
              size="sm"
              className="gap-1"
              startContent={<PiLightbulb className="text-lg" />}
            >
              تفکر استدلالی
            </Button>
          </div>
          <div className="block md:hidden">
            <Button
              onPress={toggleIsReasoning}
              isIconOnly
              radius="full"
              color={isReasoning ? "primary" : "default"}
              variant={isReasoning ? "flat" : "bordered"}
              size="sm"
            >
              <PiLightbulb className="text-lg" />
            </Button>
          </div>

          <div className="hidden md:block">
            <Button
              onPress={imageGeneration}
              radius="full"
              color="default"
              variant="bordered"
              size="sm"
              className="gap-1"
              startContent={<PiPaintBrush className="text-lg" />}
            >
              تولید عکس
            </Button>
          </div>
          <div className="block md:hidden">
            <Button
              onPress={imageGeneration}
              isIconOnly
              radius="full"
              color="default"
              variant="bordered"
              size="sm"
            >
              <PiPaintBrush className="text-lg" />
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
            className={
              isTemporary ? "bg-zinc-500 text-zinc-800" : "bg-black text-white"
            }
            isLoading={isLoading}
            type="submit"
          >
            {text ? (
              <PiArrowUpBold className="text-lg" />
            ) : (
              <PiWaveformBold className="text-lg" />
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
