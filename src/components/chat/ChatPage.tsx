import { useState, useRef, useEffect } from 'react'
import { useProfileStore } from '../../store/useProfileStore'
import { useChatStore } from '../../store/useChatStore'
import { matchQuery } from '../../engine/matcher'

const WELCOME_MESSAGE = '你好，我是你的孕期助手 🤰\n\n可以问我关于孕期饮食、运动、症状、产检等各种问题。\n\n试试问我：\n· "孕吐怎么缓解？"\n· "第12周需要注意什么？"\n· "孕期可以吃什么？"'

const SUGGESTIONS = [
  '孕期可以喝咖啡吗？',
  '孕吐怎么缓解？',
  '孕期做什么运动好？',
  '产检有哪些项目？',
]

export default function ChatPage() {
  const [input, setInput] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const profile = useProfileStore(s => s.profile)
  const { messages, addMessage } = useChatStore()

  const displayMessages = messages.length === 0
    ? [{ id: 'welcome', role: 'assistant' as const, content: WELCOME_MESSAGE, timestamp: Date.now() }]
    : messages

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [displayMessages])

  const handleSend = () => {
    const text = input.trim()
    if (!text || isSearching) return

    const userMsg = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: text,
      timestamp: Date.now(),
    }
    addMessage(userMsg)
    setInput('')
    setIsSearching(true)

    setTimeout(() => {
      const response = matchQuery(text, profile)
      const assistantMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: response.text,
        timestamp: Date.now(),
        results: response.results,
      }
      addMessage(assistantMsg)
      setIsSearching(false)
    }, 600)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggestedClick = (question: string) => {
    setInput(question)
  }

  return (
    <div className="flex flex-col h-full">
      {/* 聊天区域 */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
        {displayMessages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] animate-fade-in-up`}>
              {msg.role === 'user' ? (
                <div className="bg-sage-500 text-white rounded-2xl rounded-br-md px-5 py-3 text-sm leading-relaxed shadow-sm">
                  {msg.content}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-white rounded-2xl rounded-bl-md px-5 py-4 text-sm text-sage-700 shadow-sm border border-cream-300/40 leading-relaxed">
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>

                  {msg.results && msg.results.length > 0 && (
                    <div className="space-y-2.5">
                      {msg.results.slice(0, 3).map((result, i) => {
                        const item = result.item as any
                        const title = item.title || item.name || item.question || ''

                        return (
                          <div
                            key={i}
                            className="bg-white rounded-xl px-4 py-3 shadow-sm border border-cream-300/40 text-sm"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-base">
                                {result.type === 'recipe' ? '🍳' :
                                 result.type === 'exercise' ? '🧘' :
                                 result.type === 'faq' ? '💡' :
                                 result.type === 'problem' ? '💊' : '📅'}
                              </span>
                              <span className="font-medium text-sage-800">{title}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {isSearching && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-bl-md px-5 py-4 shadow-sm border border-cream-300/40">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-sage-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-sage-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-sage-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 建议问题 */}
      {messages.length === 0 && (
        <div className="px-5 pb-3 flex gap-2.5 overflow-x-auto hide-scrollbar">
          {SUGGESTIONS.map(q => (
            <button
              key={q}
              onClick={() => handleSuggestedClick(q)}
              className="flex-shrink-0 px-4 py-2 bg-white border border-cream-300/60 rounded-full text-xs text-sage-600 hover:bg-sage-50 hover:border-sage-200 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* 输入区域 */}
      <div className="p-4 bg-cream-100/95 backdrop-blur-sm border-t border-cream-300/40">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入你的问题..."
            className="flex-1 px-5 py-3 bg-white rounded-2xl text-sm border border-cream-300/60 focus:outline-none focus:border-sage-300 focus:ring-2 focus:ring-sage-100 transition-all placeholder:text-sage-300"
            disabled={isSearching}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isSearching}
            className="w-11 h-11 bg-sage-500 text-white rounded-2xl flex items-center justify-center hover:bg-sage-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-lg shadow-sm"
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  )
}
