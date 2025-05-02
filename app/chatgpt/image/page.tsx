"use client";

import React, { useState, useEffect, useRef } from "react";
import { useConversationStore } from "@/store/chatgpt";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import ImageInputBar from "@/components/chatgpt/ImageInputBar";
import Sidebar from "@/components/chatgpt/Sidebar";
import { Conversation, GeneratedImage } from "@/types/chatgpt";
import { Button } from "@heroui/button";
import {
  PiChatCircleSlash,
  PiCheckCircle,
  PiList,
  PiHouse,
  PiNotePencil,
  PiRobot,
  PiShareFat,
  PiOpenAiLogo,
  PiChatCircle,
  PiPaintBrush,
  PiArrowsClockwise,
  PiDownload,
} from "react-icons/pi";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { imageGenerationModels } from "@/lib/chatgpt/models";
import { Spinner } from "@heroui/spinner";
import { Alert } from "@heroui/alert";

export default function ImageGenerationPage() {
  const { resetConversation } = useConversationStore();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [modelIdx, setModelIdx] = useState<number>(0);
  const [sizeIdx, setSizeIdx] = useState<number>(0);
  const [qualityIdx, setQualityIdx] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [image, setImage] = useState<GeneratedImage | null>(null);
  const statusIntervalRef = useRef<NodeJS.Timeout | null>(null);

  async function loadConversations() {
    const response = await api("/chatgpt/conversations", "GET");
    if (response.ok) {
      setConversations(response.data.conversations);
    }
  }

  async function checkImageStatus(id: number) {
    const response = await api(`/chatgpt/image/${id}`, "GET");
    if (response.ok) {
      if (response.data.image.isDone) {
        setImage(response.data.image);
        clearInterval(statusIntervalRef.current!);
        setIsLoading(false);
      }
    }
  }

  async function createImage(inputText: string) {
    if (isLoading) return;
    if (inputText.trim()) {
      setIsLoading(true);
      setImage(null);
      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current);
      }
      statusIntervalRef.current = null;
      const response = await api("/chatgpt/image", "POST", {
        prompt: inputText,
        model: imageGenerationModels[modelIdx].model,
        size: imageGenerationModels[modelIdx].sizes[sizeIdx],
        quality: imageGenerationModels[modelIdx].qualities[qualityIdx],
      });

      if (response.ok) {
        setImage(response.data.image);
        statusIntervalRef.current = setInterval(() => {
          checkImageStatus(response.data.image.id);
        }, 5000);
      } else {
        setIsLoading(false);
      }
    }
  }

  function backToHome() {
    resetConversation();
    router.push("/");
  }

  function backToText() {
    resetConversation();
    router.push("/chatgpt");
  }

  useEffect(() => {
    loadConversations();
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative bg-background">
      <div className="flex items-center justify-between text-gray-700 gap-1 p-2 px-3 bg-background fixed top-0 right-0 w-full z-50">
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
          <div className="block md:hidden">
            <Button
              onPress={backToText}
              isIconOnly
              radius="full"
              color={"default"}
              variant={"bordered"}
              size="sm"
              className="gap-1"
            >
              <PiChatCircle className="text-lg" />
            </Button>
          </div>
          <div className="hidden md:block">
            <Button
              onPress={backToText}
              radius="full"
              color={"default"}
              variant={"bordered"}
              size="sm"
              className="gap-1"
              startContent={<PiChatCircle className="text-lg" />}
            >
              بازشگت به گفتگو
            </Button>
          </div>
        </div>

        <Dropdown>
          <DropdownTrigger>
            <Button
              radius="full"
              color={"default"}
              variant={"bordered"}
              size="sm"
              className="gap-1"
              endContent={<PiOpenAiLogo className="text-lg" />}
            >
              {imageGenerationModels[modelIdx].name}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            variant="faded"
            onAction={(key) => {
              setSizeIdx(0);
              setQualityIdx(0);
              setModelIdx(parseInt(key.toString()));
            }}
          >
            {imageGenerationModels.map((m, idx) => {
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
      <div
        className={`flex flex-col gap-4 items-center justify-between ${
          !image && "md:justify-start"
        } px-0 flex-1`}
      >
        {image ? (
          <>
            <div></div>
            {!image.isDone ? (
              <div className="w-full flex flex-col items-center justify-center gap-3">
                <Spinner size="lg" />
                <p className="text-center max-w-xs text-sm text-gray-700">
                  عکس شما در حال تولید شدن است. تولید عکس ممکن است کمی زمان بر
                  باشد. اگر نمیخواهید صبر کنید میتوانید صفحه را ببندید و عکس
                  تولید شده را بعدا در گالری خود مشاهده کنید
                </p>
              </div>
            ) : image.error ? (
              <div className="w-full max-w-xs">
                <Alert
                  color="danger"
                  description="خطایی رخ داد و عکس تولید نشد. لطفا دوباره تلاش کنید."
                  title="خطا"
                />
              </div>
            ) : (
              <div className="md:max-w-[45rem] mx-auto mt-2">
                <img
                  src={image.output!}
                  alt={`image ${image.id}`}
                  className="block md:max-w-[45rem] mx-auto"
                />
                <div className="mt-2 flex items-center justify-center gap-1">
                  <Button
                    color="primary"
                    variant="flat"
                    size="sm"
                    className="gap-1"
                  >
                    <PiDownload className="text-lg" />
                    <span>دانلود</span>
                  </Button>
                  <Button
                    color="warning"
                    variant="flat"
                    size="sm"
                    className="gap-1"
                  >
                    <PiPaintBrush className="text-lg" />
                    <span>ویرایش</span>
                  </Button>
                  <Button
                    color="secondary"
                    variant="flat"
                    size="sm"
                    className="gap-1"
                  >
                    <PiArrowsClockwise className="text-lg" />
                    <span>تولید مجدد</span>
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-2xl pt-[14rem] font-bold">تولید عکس</div>
        )}
        <div className={`w-full bg-background p-2`}>
          <div className="w-full md:max-w-[45rem] mx-auto">
            <ImageInputBar
              onSubmit={createImage}
              isLoading={isLoading}
              modelIdx={modelIdx}
              sizeIdx={sizeIdx}
              setSizeIdx={setSizeIdx}
              qualityIdx={qualityIdx}
              setQualityIdx={setQualityIdx}
            />
          </div>
        </div>
      </div>

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        conversations={conversations}
      />
    </div>
  );
}
