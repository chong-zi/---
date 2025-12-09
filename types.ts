/// <reference types="vite/client" />
// Provide Vite client types so `import.meta.env` is correctly typed in TS.

export interface Attachment {
  id: string;
  type: 'chart' | 'code' | 'image';
  title: string;
  content: string; // URL or data content
  description?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  attachment?: Attachment;
  // Optional: extended properties for richer UI
  thinking?: boolean;
  relatedQuestions?: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}