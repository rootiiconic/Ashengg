// firstone
"use client"

import { useRef, useEffect } from "react"
import { Send } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: string
}

interface ChatSectionProps {
  messages: Message[]
  inputMessage: string
  setInputMessage: (message: string) => void
  onSendMessage: (message: string) => void
  isLoading: boolean
  smoothMousePosition: { x: number; y: number }
}

export default function ChatSection({
  messages,
  inputMessage,
  setInputMessage,
  onSendMessage,
  isLoading,
  smoothMousePosition,
}: ChatSectionProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = () => {
    onSendMessage(inputMessage)
    setInputMessage("")
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="w-full md:w-1/4 flex flex-col h-full">
      <div
        className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4 flex-grow overflow-hidden flex flex-col transform-gpu transition-all duration-700 ease-out will-change-transform"
        style={{
          transform: `perspective(1000px) rotateX(${smoothMousePosition.y * 0.1}deg) rotateY(${smoothMousePosition.x * 0.1}deg)`,
        }}
      >
        <div className="flex-grow overflow-y-auto pr-2" ref={chatContainerRef}>
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin"></div>
                  <div className="absolute inset-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"></div>
                </div>
                <p className="mt-4 text-gray-300">Analyzing project data...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 py-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-tr-none"
                        : "bg-white/10 rounded-tl-none"
                    }`}
                  >
                    <div className="text-sm">{message.content}</div>
                    <div className="text-xs text-gray-400 mt-1 text-right">{formatTime(message.timestamp)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="mt-4 relative">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask about your project..."
            className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-6 pr-12 focus:outline-none focus:border-cyan-400/50 transition-colors"
          />
          <button
            onClick={handleSendMessage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-purple-500 p-2 rounded-full hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}