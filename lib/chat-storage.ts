export interface ChatMessage {
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export interface ChatConversation {
  id: string;
  messages: ChatMessage[];
  timestamp: Date;
  title?: string;
}

export interface SavedSearch {
  id: string;
  query: string;
  filters?: any;
  timestamp: Date;
  resultCount?: number;
}