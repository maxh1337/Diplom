import { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { useDebugTgZustand } from "../../../shared/hooks/useDebugTg";
import { useShowBottomMenu } from "../../../shared/hooks/useShowBottomMenu";
import { useChatZustand } from "../hooks/useChatZustand";
import useParseMarkdown from "../hooks/useParseMarkdown";
import useSendMessage from "../hooks/useSendMessages";
import useViewport from "../hooks/useViewport";

export type Message = {
  id: string;
  role: "assistant" | "user" | "system";
  content: string;
};

const GeminiChatbot = () => {
  const { messages, message, setMessage, isLoading } = useChatZustand();
  const { handleSendMessage } = useSendMessage();
  const setBottomMenuVisible = useShowBottomMenu((s) => s.setIsVisible);
  const { parseMarkdown } = useParseMarkdown();
  const { isKeyboardOpen } = useViewport();
  const { platform } = useDebugTgZustand();
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFocus = () => {
    if (platform !== "tdesktop") {
      setBottomMenuVisible(false);
    }
    inputRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBlur = () => {
    if (!isKeyboardOpen && platform !== "tdesktop") {
      setBottomMenuVisible(true);
    }
  };

  return (
    <div
      className="flex flex-col w-full bg-secondary text-white transition-all duration-300 rounded-3xl"
      style={{
        height: isKeyboardOpen
          ? "calc(var(--tg-viewport-height, 100vh) - env(safe-area-inset-top) - env(safe-area-inset-bottom))"
          : platform !== "ios" && platform !== "android"
          ? "85vh"
          : "77vh",
      }}
    >
      <p className=" mt-3 ml-4 font-brain font-bold text-xl">Чат с ИИ</p>
      <div className="flex-1 overflow-y-auto p-4 rounded-xl m-2">
        <div className="flex flex-col gap-2">
          {messages
            .filter((msg: Message) => msg.role !== "system")
            .map((msg: Message) => (
              <div
                key={msg.id}
                className={twMerge(
                  "bg-gray-800 text-white p-3 rounded-lg max-w-[80%] mb-4 font-unbound",
                  msg.role === "user"
                    ? " bg-third text-white self-end"
                    : " bg-third text-white self-start"
                )}
                dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.content) }}
              />
            ))}
          {isLoading && (
            <div className="p-3 rounded-lg bg-gray-800 self-start text-center flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-4 border-gray-700 border-t-white"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="w-full px-4 transition-transform duration-300">
        <div className="flex gap-2 py-3">
          <input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
            className="flex-1 bg-third placeholder:text-fourth px-4 py-2 rounded-xl outline-none text-white font-brain w-full"
            placeholder="Спроси что-нибудь..."
          />
          <button
            onClick={handleSendMessage}
            className="bg-third text-white rounded-xl px-4 py-2 cursor-pointer hover:bg-black hover:text-white transition-colors ease-in-out duration-200 font-unbound"
          >
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeminiChatbot;
