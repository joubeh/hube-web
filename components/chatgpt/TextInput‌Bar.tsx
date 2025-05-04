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
  PiInfo,
  PiImage,
  PiFile,
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
import { Spinner } from "@heroui/spinner";
import { addToast } from "@heroui/toast";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";

const imagesExtensions = [".png", ".jpeg", ".jpg", ".webp"];
const allowedExtensions = [
  ".c",
  ".cpp",
  ".cs",
  ".css",
  ".doc",
  ".docx",
  ".go",
  ".html",
  ".java",
  ".js",
  ".json",
  ".md",
  ".pdf",
  ".php",
  ".pptx",
  ".py",
  ".rb",
  ".sh",
  ".tex",
  ".ts",
  ".txt",
  ...imagesExtensions,
];
const acceptString = allowedExtensions.join(",");

export default function TextInputBar({
  isLoading,
  onSubmit,
  showImageGenerationAlert,
  setIsLoading,
}: {
  isLoading: boolean;
  onSubmit: (inputText: string) => void;
  showImageGenerationAlert: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
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
    files,
    addFile,
    removeFile,
  } = useConversationStore();

  function adjustHeight() {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height
      textarea.style.height = textarea.scrollHeight + "px"; // Set to scrollHeight
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (text.trim()) {
      const input: string = text;
      onSubmit(input);
      setText("");
    }
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileExtension = (filename: string): string | null => {
    const lastDotIndex = filename.lastIndexOf(".");
    if (lastDotIndex > 0) {
      return filename.substring(lastDotIndex).toLowerCase();
    }
    return null;
  };

  const uploadFile = async (file: File) => {
    setIsLoading(true);
    const type = imagesExtensions.includes(getFileExtension(file.name) ?? "")
      ? "image"
      : "file";

    const fileId = -1 * Date.now();
    addFile({
      id: fileId,
      url: "pending",
      type: type,
      expiresAt: `${Date.now()}`,
      processing: true,
    });

    const formData = new FormData();
    if (type === "image") {
      formData.append("image", file);
    } else {
      formData.append("file", file);
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chatgpt/file/upload`,
        {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        removeFile(fileId);
        addFile(data.file);
      } else {
        throw new Error(data?.error || "خطایی پیش آمده دوباره تلاش کنید");
      }
    } catch (error: any) {
      removeFile(fileId);
      addToast({
        title: "خطا",
        description: error?.message || "خطایی پیش آمده دوباره تلاش کنید",
        color: "danger",
      });
    }
    removeFile(fileId);
    // IMPORTANT: Reset the file input value so selecting the same file again works
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsLoading(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const extension = getFileExtension(file.name);
      if (!extension || !allowedExtensions.includes(extension)) {
        addToast({
          title: "خطا",
          description: `پسوندهای مجاز: ${allowedExtensions.join(", ")}`,
          color: "danger",
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }
      uploadFile(file);
    } else {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [text]);

  return (
    <form
      onSubmit={handleSubmit}
      className={`px-4 py-3 shadow md:shadow-lg rounded-3xl border border-gray-300 w-full ${
        isTemporary && "bg-zinc-800 text-white dark"
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        disabled={isLoading}
        accept={acceptString}
      />

      {files.length > 0 && (
        <>
          <div className="flex items-center gap-1 mb-3">
            {files.map((f) => (
              <Popover
                key={f.id}
                showArrow
                backdrop={"opaque"}
                offset={10}
                placement="top"
                size="sm"
              >
                <PopoverTrigger>
                  <Button
                    size="sm"
                    variant="flat"
                    color={f.processing ? "default" : "primary"}
                    className="gap-1"
                    radius="full"
                    startContent={
                      f.processing ? (
                        <Spinner size="sm" color="primary" />
                      ) : f.type === "image" ? (
                        <PiImage className="text-xl shrink-0" />
                      ) : (
                        <PiFile className="text-xl shrink-0" />
                      )
                    }
                  >
                    {f.type === "image" ? "عکس" : "فایل"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  {(titleProps) => (
                    <div className="px-1 py-2 w-full">
                      <Button
                        onPress={(e) => removeFile(f.id)}
                        size="sm"
                        color={f.processing ? "default" : "danger"}
                        isDisabled={f.processing ?? false}
                      >
                        {f.processing ? "در حال آپلود..." : "حذف"}
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            ))}
          </div>
          <div className="bg-white text-gray-700 flex text-xs gap-1 mb-1">
            <PiInfo className="text-lg" />
            <span>فایل های آپلودی بعد از ۶ ساعت غیرفعال میشوند</span>
          </div>
        </>
      )}

      {showImageGenerationAlert && isImageGeneration && (
        <div className="bg-white text-gray-700 flex text-xs gap-1 mb-1">
          <PiInfo className="text-lg shrink-0" />
          <span>مدل تولید عکس به پیام های قبلی دسترسی ندارد</span>
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
            onPress={(e) => {
              if (!isImageGeneration) fileInputRef.current?.click();
            }}
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
