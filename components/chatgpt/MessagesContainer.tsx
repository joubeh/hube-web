"use client";

import { Message } from "@/types/chatgpt";
import { memo } from "react";
import { Button } from "@heroui/button";
import {
  PiCopy,
  PiPencilSimple,
  PiSpeakerHigh,
  PiArrowsClockwise,
  PiDownload,
} from "react-icons/pi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import copy from "@/lib/copy";

function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div
      className="prose prose-sm md:prose-base prose-p:text-black max-w-none prose-code:before:content-[''] prose-code:after:content-['']"
      dir="auto"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            if (match) {
              const codeContent = String(children).replace(/\n$/, "");
              return (
                <div className="relative bg-[#282c34] rounded-md overflow-hidden shadow-md">
                  <div className="absolute top-0 left-2 px-2 py-0.5 text-xs text-gray-400 bg-[#21252b] rounded-b-md z-10">
                    {match[1]}
                  </div>
                  <div className="absolute top-1 right-1 opacity-100 z-10">
                    <Button
                      color="default"
                      variant="light"
                      size="sm"
                      isIconOnly
                      onPress={() => copy(codeContent)}
                      aria-label="Copy code"
                      className="text-gray-400 hover:text-white"
                    >
                      <PiCopy size={16} />
                    </Button>
                  </div>
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      padding: "1.5rem 1rem 1rem 1rem",
                      fontSize: "0.875rem",
                      lineHeight: "1.5",
                      borderRadius: "0",
                      backgroundColor: "transparent",
                    }}
                    {...props}
                  >
                    {codeContent}
                  </SyntaxHighlighter>
                </div>
              );
            } else {
              const inlineCodeContent = String(children).trim();
              return (
                <span
                  className={`font-mono bg-gray-200 text-sm rounded text-black py-1 px-1.5 ${
                    className || ""
                  }`}
                  {...props}
                >
                  {inlineCodeContent}
                </span>
              );
            }
          },
          a: (props) => (
            <a className="text-blue-700" target="_blank" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function UserMessage({
  message,
  isOwner,
}: {
  message: Message;
  isOwner: boolean;
}) {
  return (
    <div>
      <div className="flex justify-start">
        <div className="bg-gray-100 py-3 px-4 rounded-3xl">
          <div
            className="prose prose-sm md:prose-base prose-p:text-black max-w-none"
            dir="auto"
          >
            <p>{message.content}</p>
          </div>
        </div>
      </div>
      <div>
        {isOwner && (
          <Button isIconOnly color="default" variant="light" size="sm">
            <PiPencilSimple />
          </Button>
        )}
        <Button
          onPress={(e) => copy(message.content)}
          isIconOnly
          color="default"
          variant="light"
          size="sm"
        >
          <PiCopy />
        </Button>
      </div>
    </div>
  );
}

function AssistantMessage({
  message,
  isOwner,
}: {
  message: Message;
  isOwner: boolean;
}) {
  return (
    <div>
      <div>
        {message.type === "text" ? (
          <MarkdownRenderer content={message.content} />
        ) : (
          <img src={message.content} alt="output" />
        )}
      </div>
      <div dir="ltr">
        <Button
          onPress={(e) => copy(message.content)}
          isIconOnly
          color="default"
          variant="light"
          size="sm"
        >
          <PiCopy />
        </Button>
        <Button isIconOnly color="default" variant="light" size="sm">
          <PiSpeakerHigh />
        </Button>
        {isOwner && (
          <Button isIconOnly color="default" variant="light" size="sm">
            <PiArrowsClockwise />
          </Button>
        )}
        {message.type === "image" && (
          <Button isIconOnly color="default" variant="light" size="sm">
            <a href={message.content} download target="_blank">
              <PiDownload />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}

const MessagesContainer = memo(function ChatMessages({
  messages,
  processingMessage,
  isOwner,
}: {
  messages: Message[];
  processingMessage: string;
  isOwner: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 w-full md:max-w-[45rem] px-4">
      {messages.map((message) => {
        if (message.role === "user")
          return (
            <UserMessage key={message.id} message={message} isOwner={isOwner} />
          );
        return (
          <AssistantMessage
            key={message.id}
            message={message}
            isOwner={isOwner}
          />
        );
      })}
      {processingMessage && <MarkdownRenderer content={processingMessage} />}
    </div>
  );
});

export default MessagesContainer;
