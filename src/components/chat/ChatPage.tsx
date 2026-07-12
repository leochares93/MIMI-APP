import { useState, useRef, useEffect } from 'react'
import { useProfileStore } from '../../store/useProfileStore'
import { useChatStore } from '../../store/useChatStore'
import { matchQuery } from '../../engine/matcher'

export default function ChatPage() {
  const [input, setInput] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const profile = useProfileStore(s => s.profile)
  const { messages, addMessage } = useChatStore()

  const displayMessages = messages.length === 0
    ? [{ id: 'welcome', role: 'assistant' as const, content: '你好呀，我是你的孕期助手 🤰\n\n有什么想了解的吗？饮食、运动、症状、产检……随时问我。', timestamp: Date.now() }]
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
      const r = matchQuery(text, profile)
      addMessage({ id: (Date.now()+1).toString(), role: 'assistant', content: r.text, timestamp: Date.now(), results: r.results })
      setIsSearching(false)
    }, 500)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
        {displayMessages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[88%] animate-fade-in-up`}>
              {msg.role === 'user' ? (
                <div className="bg-peach-500 text-white rounded-2xl rounded-br-sm px-5 py-3 text-sm leading-relaxed shadow-md">{msg.content}</div>
              ) : (
                <div>
                  <div className="text-sm text-warm-900/55 leading-relaxed whitespace-pre-wrap px-1">{msg.content}</div>
                  {msg.results && msg.results.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      {msg.results.slice(0, 3).map((res, j) => {
                        const item = res.item as any
                        return (
                          <div key={j} className="flex items-center gap-3 px-3 py-2.5 bg-white rounded-xl border border-warm-200/40 shadow-sm">
                            <span>{res.type === 'recipe' ? '🍳' : res.type === 'exercise' ? '🧘' : res.type === 'faq' ? '💡' : res.type === 'problem' ? '💊' : '📅'}</span>
                            <span className="text-sm text-warm-900/55 font-medium">{item.title || item.name || item.question}</span>
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
            <span className="w-2 h-2 bg-peach-300 rounded-full animate-bounce" />
            <span className="w-2 h-2 bg-peach-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-peach-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length === 0 && (
        <div className="px-5 pb-3">
          <p className="text-xs text-warm-900/25 mb-2.5 font-medium tracking-wide">试试这些问题：</p>
          <div className="flex flex-wrap gap-2">
            {['孕期可以喝咖啡吗？','孕吐怎么缓解？','孕期做什么运动好？','产检有哪些项目？'].map(q => (
              <button key={q} onClick={() => setInput(q)} className="text-xs px-4 py-2 bg-white border border-warm-200/40 rounded-full text-warm-900/45 hover:bg-peach-50 hover:border-peach-200 hover:text-peach-500 transition-colors">{q}</button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 bg-[#FEF9F3]/90 backdrop-blur-xl border-t border-warm-200/40">
        <div className="flex items-center gap-2">
          <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key==='Enter'&&!e.shiftKey){e.preventDefault();handleSend()} }} placeholder="输入问题…" className="flex-1 px-5 py-3 bg-white border border-warm-200/60 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-peach-300/50 transition-all placeholder:text-warm-900/20" disabled={isSearching} />
          <button onClick={handleSend} disabled={!input.trim()||isSearching} className="w-11 h-11 bg-peach-500 text-white rounded-2xl flex items-center justify-center hover:bg-peach-600 disabled:opacity-30 transition-all shadow-md">↑</button>
        </div>
      </div>
    </div>
  )
}
