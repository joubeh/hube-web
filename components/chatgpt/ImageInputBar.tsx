"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@heroui/button";
import {
  PiWaveformBold,
  PiPlus,
  PiLightbulb,
  PiArrowUpBold,
  PiMicrophone,
  PiGlobeSimple,
  PiPaintBrush,
  PiArrowsOut,
  PiStarFour,
} from "react-icons/pi";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { imageGenerationModels } from "@/lib/chatgpt/models";

export default function ImageInputBar({
  isLoading,
  onSubmit,
  modelIdx,
  sizeIdx,
  setSizeIdx,
  qualityIdx,
  setQualityIdx,
}: {
  isLoading: boolean;
  onSubmit: (inputText: string) => void;
  modelIdx: number;
  sizeIdx: number;
  setSizeIdx: React.Dispatch<React.SetStateAction<number>>;
  qualityIdx: number;
  setQualityIdx: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [text, setText] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

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

  return (
    <form
      onSubmit={handleSubmit}
      className="px-4 py-3 shadow md:shadow-lg rounded-3xl border border-gray-300 w-full"
    >
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
        placeholder="عکس را توصیف کنید"
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

          <Dropdown dir="ltr">
            <DropdownTrigger>
              <Button
                radius="full"
                color="default"
                variant="bordered"
                size="sm"
              >
                {imageGenerationModels[modelIdx].sizes[sizeIdx]}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              variant="faded"
              onAction={(key) => setSizeIdx(parseInt(key.toString()))}
            >
              {imageGenerationModels[modelIdx].sizes.map((s, idx) => {
                return <DropdownItem key={idx}>{s}</DropdownItem>;
              })}
            </DropdownMenu>
          </Dropdown>

          <Dropdown dir="ltr">
            <DropdownTrigger>
              <Button
                radius="full"
                color="default"
                variant="bordered"
                size="sm"
              >
                {imageGenerationModels[modelIdx].qualities[qualityIdx]}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              variant="faded"
              onAction={(key) => setQualityIdx(parseInt(key.toString()))}
            >
              {imageGenerationModels[modelIdx].qualities.map((q, idx) => {
                return <DropdownItem key={idx}>{q}</DropdownItem>;
              })}
            </DropdownMenu>
          </Dropdown>
        </div>
        <Button
          isIconOnly
          radius="full"
          color="default"
          size="sm"
          className="bg-black text-white"
          isLoading={isLoading}
          type="submit"
        >
          <PiArrowUpBold className="text-lg" />
        </Button>
      </div>
    </form>
  );
}
