"use client"

import { useState, useEffect, useRef } from "react"
import { Download, Share2, ArrowLeft } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import ChatSection from "@/components/project/ChatSection"
import MainContentSection from "@/components/project/MainContentSection"

interface ProjectData {
  description: string
  files: string[]
  role: string | null
  timestamp: string
  messages?: { role: "user" | "assistant"; content: string; timestamp: string }[]
}

export default function ProjectPage() {
  const [projectData, setProjectData] = useState<ProjectData | null>(null)
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string; timestamp: string }[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [activeMainTab, setActiveMainTab] = useState("app") // Default to app tab
  const [activeReportTab, setActiveReportTab] = useState("summary")
  const [isLoading, setIsLoading] = useState(true)
  const [smoothMousePosition, setSmoothMousePosition] = useState({ x: 0, y: 0 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const animationFrameRef = useRef<number>()
  const router = useRouter()
  const params = useParams()

  // Smooth animation for mouse tracking
  const animate = () => {
    setSmoothMousePosition((prev) => ({
      x: prev.x + (mousePosition.x - prev.x) * 0.05,
      y: prev.y + (mousePosition.y - prev.y) * 0.05,
    }))
    animationFrameRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    // Get project data based on ID
    const projectId = params.id as string

    // Try to get from sessionStorage first (for newly created projects)
    let storedData = sessionStorage.getItem(`project_${projectId}`)

    if (storedData) {
      const data = JSON.parse(storedData) as ProjectData & {
        messages?: { role: "user" | "assistant"; content: string; timestamp: string }[]
      }
      setProjectData(data)

      // Set initial messages if they exist in the stored data
      if (data.messages) {
        setMessages(data.messages)
      } else {
        // Add initial AI message based on project description
        setTimeout(() => {
          setMessages([
            {
              role: "assistant" as const,
              content: `I've analyzed your project: "${data.description}". Let's start building this engineering solution. What specific aspects would you like to focus on first?`,
              timestamp: new Date().toISOString(),
            },
          ])
        }, 1500)
      }
      setIsLoading(false)
    } else {
      // If no data found, redirect to projects page
      console.log("No project data found for ID:", projectId)
      router.push("/projects")
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      })
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [router, params.id])

  const handleSendMessage = async (message: string) => {
    if (message.trim()) {
      // Add user message
      const newMessages = [
        ...messages,
        {
          role: "user" as const,
          content: message,
          timestamp: new Date().toISOString(),
        },
      ]
      setMessages(newMessages)

      try {
        const res = await fetch("http://localhost:8000/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: message }),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json() as { response: string };
        const updatedMessages = [
          ...newMessages,
          {
            role: "assistant" as const,
            content: data.response,
            timestamp: new Date().toISOString(),
          },
        ];
        
        setMessages(updatedMessages);

        // Update messages in sessionStorage
        if (projectData && params.id) {
          const updatedProjectData = {
            ...projectData,
            messages: updatedMessages
          };
          sessionStorage.setItem(`project_${params.id}`, JSON.stringify(updatedProjectData));
        }

      } catch (err) {
        console.error("API error:", err);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant" as const,
            content: "Sorry, there was an error processing your request.",
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/projects")}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Projects</span>
              </button>
              <div className="h-6 w-px bg-white/20" />
              <div
                className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent transform-gpu transition-all duration-700 ease-out hover:scale-105 will-change-transform"
                style={{
                  transform: `perspective(1000px) rotateX(${smoothMousePosition.y * 1}deg) rotateY(${smoothMousePosition.x * 1}deg)`,
                }}
              >
                {projectData?.description.split(" ").slice(0, 3).join(" ")}
                {projectData && projectData.description.split(" ").length > 3 ? "..." : ""}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button className="bg-gradient-to-r from-cyan-500 to-purple-500 px-6 py-2 rounded-full hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-500 ease-out transform-gpu hover:scale-105 will-change-transform">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      <div className="pt-20 pb-6 h-screen flex flex-col">
        <div className="container mx-auto px-6 flex-grow flex flex-col md:flex-row gap-6 h-full">
          {/* Chat Section */}
          <ChatSection
            messages={messages}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            smoothMousePosition={smoothMousePosition}
          />

          {/* Main Content Section */}
          <MainContentSection
            projectData={projectData}
            activeMainTab={activeMainTab}
            setActiveMainTab={setActiveMainTab}
            activeReportTab={activeReportTab}
            setActiveReportTab={setActiveReportTab}
            smoothMousePosition={smoothMousePosition}
          />
        </div>
      </div>
    </div>
  )
}