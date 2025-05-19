import { create } from "zustand";

type Message = {
  id: string;
  role: "assistant" | "user" | "system";
  content: string;
};

type ChatState = {
  messages: Message[];
  message: string;
  isLoading: boolean;
  setMessages: (messages: Message[]) => void;
  setMessage: (message: string) => void;
  setIsLoading: (isLoading: boolean) => void;
};

export const useChatZustand = create<ChatState>((set) => ({
  messages: [
    {
      id: "system-1",
      role: "system",
      content: "Отвечай только на русском языке.",
    },
  ],
  message: "",
  isLoading: false,

  setMessages: (messages) => set({ messages }),
  setMessage: (message) => set({ message }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
