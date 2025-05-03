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
  PiInfo,
} from "react-icons/pi";
import { useConversationStore } from "@/store/chatgpt";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import {
  ReasoningEffort,
  ImageSize,
  ImageQuality,
  reasoningEffortOptions,
  imageSizes,
  imageQualities,
} from "@/types/chatgpt";

export default function TextInputBar({
  isLoading,
  onSubmit,
  showImageGenerationAlert,
}: {
  isLoading: boolean;
  onSubmit: (inputText: string) => void;
  showImageGenerationAlert: boolean;
}) {
  const [text, setText] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const {
    isTemporary,
    isWebSearch,
    toggleIsWebSearch,
    isReasoning,
    toggleIsReasoning,
    isImageGeneration,
    toggleIsImageGeneration,
    exteraOptions,
    setExtraOptions,
  } = useConversationStore();

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
      className={`px-4 py-3 shadow md:shadow-lg rounded-3xl border border-gray-300 w-full ${
        isTemporary && "bg-zinc-800 text-white dark"
      }`}
    >
      {showImageGenerationAlert && isImageGeneration && (
        <div className="bg-white text-gray-700 flex text-xs gap-1 mb-1">
          <PiInfo className="text-lg" />
          <span>
            مدل تولید عکس به پیام های قبلی دسترسی ندارد. لطفا عکس را کامل توصیف
            کنید.
          </span>
        </div>
      )}
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
        placeholder={
          !isImageGeneration ? "هرچی میخوای بپرس" : "عکس را توصیف کنید"
        }
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

          {!isReasoning && !isImageGeneration && (
            <>
              <div className="hidden md:block">
                <Button
                  onPress={toggleIsWebSearch}
                  radius="full"
                  color={isWebSearch ? "primary" : "default"}
                  variant={isWebSearch ? "flat" : "bordered"}
                  size="sm"
                  className="gap-1"
                  startContent={<PiGlobeSimple className="text-lg" />}
                >
                  جستجو وب
                </Button>
              </div>
              <div className="block md:hidden">
                <Button
                  onPress={toggleIsWebSearch}
                  isIconOnly
                  radius="full"
                  color={isWebSearch ? "primary" : "default"}
                  variant={isWebSearch ? "flat" : "bordered"}
                  size="sm"
                >
                  <PiGlobeSimple className="text-lg" />
                </Button>
              </div>
            </>
          )}

          {!isWebSearch && !isImageGeneration && (
            <>
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
            </>
          )}
          {isReasoning && (
            <Dropdown dir="ltr">
              <DropdownTrigger>
                <Button
                  radius="full"
                  color="default"
                  variant="bordered"
                  size="sm"
                  dir="rtl"
                >
                  تلاش: {exteraOptions.reasoningEffort}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                variant="faded"
                onAction={(key) =>
                  setExtraOptions(
                    "reasoningEffort",
                    key.toString() as ReasoningEffort
                  )
                }
              >
                {reasoningEffortOptions.map((i) => {
                  return <DropdownItem key={i}>{i}</DropdownItem>;
                })}
              </DropdownMenu>
            </Dropdown>
          )}

          {!isWebSearch && !isReasoning && (
            <>
              <div className="hidden md:block">
                <Button
                  onPress={toggleIsImageGeneration}
                  radius="full"
                  color={isImageGeneration ? "primary" : "default"}
                  variant={isImageGeneration ? "flat" : "bordered"}
                  size="sm"
                  className="gap-1"
                  startContent={<PiPaintBrush className="text-lg" />}
                >
                  تولید عکس
                </Button>
              </div>
              <div className="block md:hidden">
                <Button
                  onPress={toggleIsImageGeneration}
                  color={isImageGeneration ? "primary" : "default"}
                  variant={isImageGeneration ? "flat" : "bordered"}
                  isIconOnly
                  radius="full"
                  size="sm"
                >
                  <PiPaintBrush className="text-lg" />
                </Button>
              </div>
            </>
          )}
          {isImageGeneration && (
            <>
              <Dropdown dir="ltr">
                <DropdownTrigger>
                  <Button
                    radius="full"
                    color="default"
                    variant="bordered"
                    size="sm"
                    dir="rtl"
                  >
                    اندازه: {exteraOptions.imageSize}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  variant="faded"
                  onAction={(key) =>
                    setExtraOptions("imageSize", key.toString() as ImageSize)
                  }
                >
                  {imageSizes.map((i) => {
                    return <DropdownItem key={i}>{i}</DropdownItem>;
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
                    dir="rtl"
                  >
                    کیفیت: {exteraOptions.imageQuality}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  variant="faded"
                  onAction={(key) =>
                    setExtraOptions(
                      "imageQuality",
                      key.toString() as ImageQuality
                    )
                  }
                >
                  {imageQualities.map((i) => {
                    return <DropdownItem key={i}>{i}</DropdownItem>;
                  })}
                </DropdownMenu>
              </Dropdown>
            </>
          )}
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
