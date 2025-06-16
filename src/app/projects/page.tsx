"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  Upload,
  Code,
  Palette,
  TestTube,
  Users,
  Heart,
  FolderOpen,
  Clock,
  Star,
  Cog,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/utils/Navbar";

export default function ProjectsPage() {
  const [projectInput, setProjectInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("my projects");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [smoothMousePosition, setSmoothMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [messages, setMessages] = useState<Array<{from: 'user' | 'agent', text: string}>>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const projectInputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const animationFrameRef = useRef<number>();
  const router = useRouter();

  // Sample projects data with categories
  const allProjects = [
    // My Projects
    {
      id: 1,
      title: "Structural Analysis AI",
      description: "Automated building analysis and optimization system",
      category: "my projects",
      type: "Structural Engineering",
      lastUpdated: "2 days ago",
      progress: 85,
      starred: true,
    },
    {
      id: 2,
      title: "Circuit Designer Pro",
      description: "AI-powered electrical circuit design and simulation",
      category: "my projects",
      type: "Electrical Systems",
      lastUpdated: "5 days ago",
      progress: 72,
      starred: true,
    },
    {
      id: 3,
      title: "Mechanical Parts Generator",
      description: "Automated CAD generation for mechanical components",
      category: "my projects",
      type: "Mechanical Design",
      lastUpdated: "1 week ago",
      progress: 64,
      starred: false,
    },
    // Vibes (Trending/Popular)
    {
      id: 4,
      title: "Neural Architecture Search",
      description: "Trending AI model for automated architecture design",
      category: "vibes",
      type: "AI/ML",
      lastUpdated: "1 day ago",
      progress: 100,
      starred: false,
    },
    {
      id: 5,
      title: "Quantum Circuit Optimizer",
      description: "Hot new quantum computing optimization tool",
      category: "vibes",
      type: "Quantum Computing",
      lastUpdated: "3 days ago",
      progress: 88,
      starred: false,
    },
    // Community
    {
      id: 6,
      title: "Open Source CAD Library",
      description: "Community-driven mechanical design components",
      category: "community",
      type: "Open Source",
      lastUpdated: "2 days ago",
      progress: 76,
      starred: false,
    },
    {
      id: 7,
      title: "Collaborative Code Review",
      description: "Community platform for engineering code reviews",
      category: "community",
      type: "Collaboration",
      lastUpdated: "4 days ago",
      progress: 92,
      starred: true,
    },
  ];

  const filteredProjects = allProjects
    .filter((project) => project.category === activeCategory)
    .filter(
      (project) =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  // Send message to FastAPI agent
  const handleSubmitProject = async () => {
    if (projectInput.trim() || uploadedFiles.length > 0) {
      // Store project data in sessionStorage with a unique ID
      const projectId = Date.now().toString();
      
      try {
        const res = await fetch("http://localhost:8000/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: projectInput }),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        
        // Create initial messages array
        const initialMessages = [
          { role: "user", content: projectInput, timestamp: new Date().toISOString() },
          { role: "assistant", content: data.response, timestamp: new Date().toISOString() }
        ];

        // Store project data with messages
        const projectData = {
          description: projectInput,
          files: uploadedFiles.map((file) => file.name),
          role: selectedRole,
          timestamp: new Date().toISOString(),
          messages: initialMessages
        };

        // Store in sessionStorage
        sessionStorage.setItem(`project_${projectId}`, JSON.stringify(projectData));

        // Navigate to the project page with the ID
        router.push(`/projects/${projectId}`);

        // Reset form
        setProjectInput("");
        setUploadedFiles([]);
        setSelectedRole(null);

      } catch (err) {
        console.error("API error:", err);
        // Handle error appropriately
        alert("Error creating project. Please try again.");
      }
    }
  };

  // Smooth animation for mouse tracking
  const animate = () => {
    setSmoothMousePosition((prev) => ({
      x: prev.x + (mousePosition.x - prev.x) * 0.05,
      y: prev.y + (mousePosition.y - prev.y) * 0.05,
    }));
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <Navbar />

      <div className="flex">
        {/* Chatbot Interface */}
        <div className={`fixed left-0 top-20 bottom-0 w-96 bg-black/30 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-500 ease-in-out ${isChatOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                AI Assistant
              </h2>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>
            
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.from === "user"
                        ? "bg-gradient-to-r from-cyan-500 to-purple-500"
                        : "bg-white/10"
                    }`}
                  >
                    <p className="text-sm text-white">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className={`flex-1 container mx-auto px-6 pt-32 pb-20 transition-all duration-500 ${isChatOpen ? 'ml-96' : ''}`}>
          {/* Project Creation Section */}
          <div
            className="mb-12 transform-gpu transition-all duration-700 ease-out will-change-transform"
            style={{
              transform: `perspective(1000px) rotateX(${
                smoothMousePosition.y * 0.2
              }deg) rotateY(${smoothMousePosition.x * 0.2}deg)`,
            }}
          >
            <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Create New Project
            </h1>

            {/* Project Input Box */}
            <div className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-2 transition-all duration-500 hover:border-cyan-400/30 hover:bg-white/10 group mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative">
                <textarea
                  ref={projectInputRef}
                  placeholder="Describe your engineering project idea..."
                  value={projectInput}
                  onChange={(e) => setProjectInput(e.target.value)}
                  className="w-full py-6 px-6 bg-transparent text-lg focus:outline-none text-white placeholder-gray-400 resize-none"
                  rows={4}
                />

                {/* Uploaded Files Display */}
                {uploadedFiles.length > 0 && (
                  <div className="px-6 pb-4">
                    <div className="flex flex-wrap gap-2">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="bg-white/10 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          <span>{file.name}</span>
                          <button
                            onClick={() =>
                              setUploadedFiles((prev) =>
                                prev.filter((_, i) => i !== index)
                              )
                            }
                            className="text-red-400 hover:text-red-300"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between px-6 pb-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      multiple
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt,.py,.js,.cpp,.java"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 transform-gpu hover:scale-105"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Add Files</span>
                    </button>
                  </div>

                  <button
                    onClick={handleSubmitProject}
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 px-8 py-3 rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform-gpu hover:scale-105 flex items-center space-x-2"
                  >
                    <Cog className="w-5 h-5" />
                    <span>Build</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Display */}
            {messages.length > 0 && (
              <div className="mt-6 space-y-4 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.from === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                        message.from === "user"
                          ? "bg-gradient-to-r from-cyan-500 to-purple-500"
                          : "bg-white/10"
                      }`}
                    >
                      <p className="text-white">{message.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Role Selection Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              {[
                {
                  id: "designer",
                  label: "Designer",
                  icon: Palette,
                  color: "from-pink-500 to-purple-500",
                },
                {
                  id: "coder",
                  label: "Coder",
                  icon: Code,
                  color: "from-cyan-500 to-blue-500",
                },
                {
                  id: "tester",
                  label: "Tester",
                  icon: TestTube,
                  color: "from-green-500 to-emerald-500",
                },
              ].map((role) => (
                <button
                  key={role.id}
                  onClick={() =>
                    setSelectedRole(selectedRole === role.id ? null : role.id)
                  }
                  className={`flex items-center space-x-3 px-6 py-3 rounded-xl border transition-all duration-500 transform-gpu hover:scale-105 will-change-transform ${
                    selectedRole === role.id
                      ? `bg-gradient-to-r ${role.color} border-transparent shadow-lg`
                      : "bg-white/5 border-white/20 hover:border-white/40 hover:bg-white/10"
                  }`}
                >
                  <role.icon className="w-5 h-5" />
                  <span className="font-medium">{role.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Projects List Component */}
          <div
            className="transform-gpu transition-all duration-700 ease-out will-change-transform"
            style={{
              transform: `perspective(1000px) rotateX(${
                smoothMousePosition.y * 0.1
              }deg) rotateY(${smoothMousePosition.x * 0.1}deg)`,
            }}
          >
            {/* Search and Category Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Projects</h2>

              {/* Category Buttons */}
              <div className="flex flex-wrap gap-4 mb-6">
                {[
                  { id: "my projects", label: "My Projects", icon: FolderOpen },
                  { id: "vibes", label: "Vibes", icon: Heart },
                  { id: "community", label: "Community", icon: Users },
                ].map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl border transition-all duration-500 transform-gpu hover:scale-105 will-change-transform ${
                      activeCategory === category.id
                        ? "bg-gradient-to-r from-cyan-500 to-purple-500 border-transparent shadow-lg"
                        : "bg-white/5 border-white/20 hover:border-white/40 hover:bg-white/10"
                    }`}
                  >
                    <category.icon className="w-5 h-5" />
                    <span className="font-medium">{category.label}</span>
                  </button>
                ))}
              </div>

              {/* Search Input */}
              <div className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-2 transition-all duration-500 hover:border-cyan-400/30 hover:bg-white/10 group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative flex items-center">
                  <Search className="w-5 h-5 text-gray-400 ml-3" />
                  <input
                    type="text"
                    placeholder={`Search in ${activeCategory}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-3 px-4 bg-transparent focus:outline-none text-white placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-between mt-4">
                <span className="text-gray-400">
                  {filteredProjects.length} project
                  {filteredProjects.length !== 1 ? "s" : ""} found
                </span>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="group backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-cyan-400/50 transition-all duration-700 ease-out transform-gpu hover:scale-105 will-change-transform cursor-pointer"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: `perspective(1000px) rotateX(${
                      project.id % 2 === 0 ? 1 : -1
                    }deg) rotateY(${
                      project.id % 3 === 0 ? 1 : project.id % 3 === 1 ? 0 : -1
                    }deg)`,
                  }}
                >
                  {/* Project Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center transform-gpu group-hover:scale-110 transition-all duration-500 ease-out"
                      style={{ transform: "translateZ(20px)" }}
                    >
                      {activeCategory === "vibes" ? (
                        <Heart className="w-6 h-6 text-pink-400" />
                      ) : activeCategory === "community" ? (
                        <Users className="w-6 h-6 text-cyan-400" />
                      ) : (
                        <FolderOpen className="w-6 h-6 text-cyan-400" />
                      )}
                    </div>

                    {project.starred && (
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    )}
                  </div>

                  {/* Project Content */}
                  <h3
                    className="text-xl font-semibold mb-2 group-hover:text-cyan-400 transition-colors transform-gpu"
                    style={{ transform: "translateZ(15px)" }}
                  >
                    {project.title}
                  </h3>

                  <p
                    className="text-gray-300 mb-6 transform-gpu"
                    style={{ transform: "translateZ(10px)" }}
                  >
                    {project.description}
                  </p>

                  {/* Project Progress */}
                  <div
                    className="mb-4 transform-gpu"
                    style={{ transform: "translateZ(10px)" }}
                  >
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">{project.type}</span>
                      <span className="text-cyan-400">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 h-1.5 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Project Footer */}
                  <div
                    className="flex justify-between items-center text-sm text-gray-400 transform-gpu"
                    style={{ transform: "translateZ(5px)" }}
                  >
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{project.lastUpdated}</span>
                    </div>
                  </div>

                  {/* 3D Card Background Effect */}
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform-gpu"
                    style={{ transform: "translateZ(-5px)" }}
                  />
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No projects found</h3>
                <p className="text-gray-400">
                  Try adjusting your search or browse a different category.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
