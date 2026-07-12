import { useState, useRef, useEffect } from 'react'
import { useProfileStore } from '../../store/useProfileStore'
import { useChatStore } from '../../store/useChatStore'
import { matchQuery } from '../../engine/matcher'

const WELCOME_MESSAGE = '你好！我是你的孕期助手 🤰\n\n我可以帮你解答孕期饮食、运动、症状、产检等各种问题。你也可以直接问我某个孕周宝宝的发育情况。\n\n试试问我：\n• "孕吐怎么缓解？"\n• "第12周需要注意什么？"\n• "孕期可以吃什么？"'

export default function ChatPage() {
  const [input, setInput] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const profile = useProfileStore(s => s.profile)
  const { messages, addMessage } = useChatStore()

  // 如果聊天记录为空，显示欢迎消息
  const displayMessages = messages.length === 0
    ? [{ id: 'welcome', role: 'assistant' as const, content: WELCOME_MESSAGE, timestamp: Date.now() }]
    : messages

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [displayMessages])

  const handleSend = () => {
    const text = input.trim()
    if (!text || isSearching) return

    // 添加用户消息
    const userMsg = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: text,
      timestamp: Date.now(),
    }
    addMessage(userMsg)
    setInput('')
    setIsSearching(true)

    // 模拟一个小的延迟以展示搜索状态
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
    }, 500)
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-2">
        {displayMessages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] animate-fade-in-up`}>
              {msg.role === 'user' ? (
                <div className="bg-primary-500 text-white rounded-2xl rounded-br-md px-4 py-3 text-sm shadow-sm">
                  {msg.content}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 text-sm text-gray-700 shadow-sm border border-gray-100">
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>

                  {/* 搜索结果卡片 */}
                  {msg.results && msg.results.length > 0 && (
                    <div className="space-y-2">
                      {msg.results.slice(0, 3).map((result, i) => {
                        const item = result.item as any
                        const title = item.title || item.name || item.question || ''
                        const summary = item.benefits || item.description || item.answer?.slice(0, 60) || ''

                        return (
                          <div
                            key={i}
                            className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-sm"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-base">
                                {result.type === 'recipe' ? '🍳' :
                                 result.type === 'exercise' ? '🧘' :
                                 result.type === 'faq' ? '💡' :
                                 result.type === 'problem' ? '💊' : '📅'}
                              </span>
                              <span className="font-medium text-gray-800">{title}</span>
                            </div>
                            {summary && (
                              <p className="text-xs text-gray-400 leading-relaxed">{summary.slice(0, 80)}...</p>
                            )}
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

        {/* 正在输入提示 */}
        {isSearching && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-primary-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-primary-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-primary-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 建议问题 */}
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto hide-scrollbar">
        {['孕期可以喝咖啡吗？', '孕吐怎么缓解？', '孕期做什么运动好？', '产检有哪些项目？'].map(q => (
          <button
            key={q}
            onClick={() => handleSuggestedClick(q)}
            className="flex-shrink-0 px-3 py-1.5 bg-white border border-primary-200 rounded-full text-xs text-primary-600 hover:bg-primary-50 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* 输入区域 */}
      <div className="p-3 bg-white border-t border-gray-100">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入你的问题..."
            className="flex-1 px-4 py-2.5 bg-gray-50 rounded-full text-sm border border-gray-200 focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-200 transition-colors"
            disabled={isSearching}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isSearching}
            className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-lg"
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  )
}
