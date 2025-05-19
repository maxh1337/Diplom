import { useState } from "react";

type Message = {
  id: string;
  role: "assistant" | "user" | "system";
  content: string;
};

const useChatMessages = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "system-1",
      role: "system",
      content: "Отвечай только на русском языке.",
    },
  ]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessageId = crypto.randomUUID();
    const newMessages: Message[] = [
      ...messages.slice(-10), // Ограничиваем до последних 10 сообщений
      { id: userMessageId, role: "user", content: message },
    ];
    setMessages(newMessages);
    setMessage("");
    setIsLoading(true);

    try {
      const apiUrl = "https://llm.chutes.ai/v1/chat/completions";
      const apiToken = import.meta.env.VITE_CHUTES_API_TOKEN;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek-ai/DeepSeek-V3-0324",
          messages: newMessages,
          stream: true,
          max_tokens: 1024,
          temperature: 0.7,
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonData = line.slice(6);
            if (jsonData === "[DONE]") break;

            try {
              const parsed = JSON.parse(jsonData);
              const content = parsed.choices?.[0]?.delta?.content || "";
              if (content) {
                aiResponse += content;
              }
            } catch (error) {
              console.error("Error parsing stream chunk:", error);
            }
          }
        }
      }

      const finalResponse = aiResponse.includes("</think>")
        ? aiResponse.split("</think>")[1]?.trim() || "Нет ответа от ИИ"
        : aiResponse || "Нет ответа от ИИ";

      setIsLoading(false);
      if (finalResponse) {
        const assistantMessageId = crypto.randomUUID();
        setMessages((prev) => [
          ...prev,
          { id: assistantMessageId, role: "assistant", content: finalResponse },
        ]);
      } else {
        const errorMessageId = crypto.randomUUID();
        setMessages((prev) => [
          ...prev,
          {
            id: errorMessageId,
            role: "assistant",
            content: "Нет ответа от ИИ",
          },
        ]);
      }
    } catch (error) {
      console.error("Error sending message to Chutes API:", error);
      setIsLoading(false);
      const errorMessageId = crypto.randomUUID();
      setMessages((prev) => [
        ...prev,
        {
          id: errorMessageId,
          role: "assistant",
          content: "Ошибка: не удалось получить ответ от ИИ",
        },
      ]);
    }
  };

  return {
    messages,
    message,
    setMessage,
    isLoading,
    handleSendMessage,
    setMessages,
  };
};

export default useChatMessages;
