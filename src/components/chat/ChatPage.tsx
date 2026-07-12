import { useState, useRef, useEffect } from 'react'
import { useProfileStore } from '../../store/useProfileStore'
import { useChatStore } from '../../store/useChatStore'
import { matchQuery } from '../../engine/matcher'

const WELCOME = '你好呀，我是你的孕期助手 🤰\n\n有什么想了解的吗？饮食、运动、症状、产检……随时问我。'

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
    }, 500)
  }

  return (
    <div className="flex flex-col h-full">
      {/* 聊天区域 */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
        {displayMessages.map((msg, i) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[88%] ${i === displayMessages.length - 1 ? 'animate-fade-in-up' : ''}`}>
              {msg.role === 'user' ? (
                <div className="bg-sage-500 text-white rounded-2xl rounded-br-sm px-5 py-3 text-sm leading-relaxed shadow-sm">
                  {msg.content}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-sm text-sage-700 leading-relaxed whitespace-pre-wrap px-1">
                    {msg.content}
                  </div>
                  {msg.results && msg.results.length > 0 && (
                    <div className="space-y-1.5">
                      {msg.results.slice(0, 3).map((result, j) => {
                        const item = result.item as any
                        const title = item.title || item.name || item.question || ''
                        return (
                          <div key={j} className="flex items-center gap-3 px-3 py-2.5 bg-white rounded-xl border border-sage-100/60 shadow-sm">
                            <span className="text-base">
                              {result.type === 'recipe' ? '🍳' : result.type === 'exercise' ? '🧘' : result.type === 'faq' ? '💡' : result.type === 'problem' ? '💊' : '📅'}
                            </span>
                            <span className="text-sm text-sage-700 font-medium">{title}</span>
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
          <div className="flex gap-1.5 px-2">
            <span className="w-2 h-2 bg-sage-300 rounded-full animate-bounce" />
            <span className="w-2 h-2 bg-sage-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-sage-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 建议问题 */}
      {messages.length === 0 && (
        <div className="px-4 pb-3">
          <p className="text-xs text-sage-400 mb-2.5 tracking-wide">试试这些问题：</p>
          <div className="flex flex-wrap gap-2">
            {['孕期可以喝咖啡吗？', '孕吐怎么缓解？', '孕期做什么运动好？', '产检有哪些项目？'].map(q => (
              <button key={q} onClick={() => setInput(q)} className="text-xs px-3.5 py-2 bg-white border border-sage-200 rounded-full text-sage-600 hover:bg-sage-50 hover:border-sage-300 transition-colors">
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 输入框 */}
      <div className="p-3 bg-cream-200/90 backdrop-blur-xl border-t border-sage-200/30">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            placeholder="输入问题…"
            className="flex-1 px-5 py-3 bg-white border border-sage-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-300/50 transition-all placeholder:text-sage-300"
            disabled={isSearching}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isSearching}
            className="w-11 h-11 bg-sage-500 text-white rounded-2xl flex items-center justify-center hover:bg-sage-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  )
}
