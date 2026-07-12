import { create } from 'zustand'
import type { ChatMessage } from '../types'
import { getStorageItem, setStorageItem } from '../utils/storage'

const STORAGE_KEY = 'pregnancy-chat-history'
const MAX_MESSAGES = 200

interface ChatState {
  messages: ChatMessage[]
  addMessage: (msg: ChatMessage) => void
  clearHistory: () => void
}

function loadMessages(): ChatMessage[] {
  return getStorageItem<ChatMessage[]>(STORAGE_KEY, [])
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: loadMessages(),

  addMessage: (msg) => {
    const messages = [...get().messages, msg].slice(-MAX_MESSAGES)
    setStorageItem(STORAGE_KEY, messages)
    set({ messages })
  },

  clearHistory: () => {
    setStorageItem(STORAGE_KEY, [])
    set({ messages: [] })
  },
}))
