import { useState, useRef, useEffect } from 'react'
import { useProfileStore } from '../../store/useProfileStore'
import { useChatStore } from '../../store/useChatStore'
import { matchQuery } from '../../engine/matcher'

const WELCOME = '你好，我是你的孕期助手 🤰\n\n可以问我关于饮食、运动、症状、产检等任何孕期问题。\n\n试试：'
const SUGGESTIONS = ['孕期可以喝咖啡吗？', '孕吐怎么缓解？', '孕期做什么运动好？', '产检有哪些项目？']

export default function ChatPage() {
  const [input, setInput] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const profile = useProfileStore(s => s.profile)
  const { messages, addMessage } = useChatStore()

  const displayMessages = messages.length === 0
    ? [{ id: 'welcome', role: 'assistant' as const, content: WELCOME, timestamp: Date.now() }]
    : messages

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [displayMessages])

  const handleSend = () => {
    const text = input.trim()
    if (!text || isSearching) return
    addMessage({ id: Date.now().toString(), role: 'user', content: text, timestamp: Date.now() })
    setInput('')
    setIsSearching(true)
    setTimeout(() => {
      const response = matchQuery(text, profile)
      addMessage({ id: (Date.now() + 1).toString(), role: 'assistant', content: response.text, timestamp: Date.now(), results: response.results })
      setIsSearching(false)
    }, 600)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <div className="flex flex-col h-full">
      {/* 聊天区域 */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
        {displayMessages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[88%] animate-fade-in-up`}>
              {msg.role === 'user' ? (
                <div className="bg-black/[0.06] text-black/75 rounded-2xl rounded-br-sm px-5 py-3 text-[15px] leading-relaxed">
                  {msg.content}
                </div>
              ) : (
                <div>
                  <div className="text-[15px] text-black/60 leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </div>
                  {msg.results && msg.results.length > 0 && (
                    <div className="mt-4 space-y-1.5">
                      {msg.results.slice(0, 3).map((result, i) => {
                        const item = result.item as any
                        const title = item.title || item.name || item.question || ''
                        return (
                          <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-xl bg-black/[0.02]">
                            <span className="text-sm">
                              {result.type === 'recipe' ? '🍳' : result.type === 'exercise' ? '🧘' : result.type === 'faq' ? '💡' : result.type === 'problem' ? '💊' : '📅'}
                            </span>
                            <span className="text-sm text-black/55 font-medium">{title}</span>
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
            <div className="flex gap-1.5 px-2">
              <span className="w-1.5 h-1.5 bg-black/20 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-black/20 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-black/20 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 建议问题 */}
      {messages.length === 0 && (
        <div className="px-5 pb-4 flex flex-wrap gap-2">
          {SUGGESTIONS.map(q => (
            <button key={q} onClick={() => setInput(q)} className="text-xs px-4 py-2 rounded-full bg-black/[0.03] text-black/45 hover:bg-black/[0.06] hover:text-black/65 transition-colors">
              {q}
            </button>
          ))}
        </div>
      )}

      {/* 输入 */}
      <div className="p-4 bg-[#faf7f2]/90 backdrop-blur-xl border-t border-black/5">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入问题…"
            className="flex-1 px-5 py-3 bg-black/[0.03] rounded-2xl text-[15px] border-0 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all placeholder:text-black/20"
            disabled={isSearching}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isSearching}
            className="w-11 h-11 bg-black/80 text-white rounded-2xl flex items-center justify-center hover:bg-black disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  )
}
