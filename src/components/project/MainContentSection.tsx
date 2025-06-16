
"use client"

import {
  ChevronRight,
  FileText,
  ImageIcon,
  BarChart2,
  Cpu,
  Zap,
  LayoutDashboard,
  Database,
  Settings,
} from "lucide-react"

interface ProjectData {
  description: string
  files: string[]
  role: string | null
  timestamp: string
}

interface MainContentSectionProps {
  projectData: ProjectData | null
  activeMainTab: string
  setActiveMainTab: (tab: string) => void
  activeReportTab: string
  setActiveReportTab: (tab: string) => void
  smoothMousePosition: { x: number; y: number }
}

export default function MainContentSection({
  projectData,
  activeMainTab,
  setActiveMainTab,
  activeReportTab,
  setActiveReportTab,
  smoothMousePosition,
}: MainContentSectionProps) {
  // Check if report tabs should be shown
  const shouldShowReportTabs = activeMainTab === "app" || activeMainTab === "website"

  return (
    <div className="w-full md:w-3/4 flex flex-col h-full">
      <div
        className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 flex-grow overflow-hidden flex flex-col transform-gpu transition-all duration-700 ease-out will-change-transform"
        style={{
          transform: `perspective(1000px) rotateX(${smoothMousePosition.y * 0.1}deg) rotateY(${smoothMousePosition.x * -0.1}deg)`,
        }}
      >
        {/* Main Tabs */}
        <div className="flex-shrink-0 border-b border-white/10 mb-6">
          <div className="flex overflow-x-auto scrollbar-hide">
            {[
              { id: "dash", label: "Dashboard", icon: LayoutDashboard },
              { id: "app", label: "App", icon: FileText },
              { id: "website", label: "Website", icon: ImageIcon },
              { id: "database", label: "Database", icon: Database },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveMainTab(tab.id)
                  // Reset report tab when switching main tabs
                  if (tab.id === "app" || tab.id === "website") {
                    setActiveReportTab("summary")
                  }
                }}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                  activeMainTab === tab.id
                    ? "border-cyan-400 text-cyan-400"
                    : "border-transparent text-gray-400 hover:text-gray-200"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Report Tabs - Only show for App and Website */}
        {shouldShowReportTabs && (
          <div className="flex-shrink-0 border-b border-white/10 mb-6">
            <div className="flex overflow-x-auto scrollbar-hide">
              {[
                { id: "dash", label: "Dashboard", icon: FileText },
                { id: "summary", label: "PRD", icon: FileText },
                { id: "design", label: "Design", icon: ImageIcon },
                { id: "code", label: "Code", icon: BarChart2 },
                { id: "resources", label: "Resources", icon: Cpu },
                { id: "performance", label: "Performance", icon: Zap },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveReportTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                    activeReportTab === tab.id
                      ? "border-purple-400 text-purple-400"
                      : "border-transparent text-gray-400 hover:text-gray-200"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-grow overflow-y-auto pr-2">
          {/* Dashboard Content */}
          {activeMainTab === "dash" && (
            <div className="space-y-6">
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-5">
                <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Project Dashboard
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white/5 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-cyan-400">85%</div>
                    <div className="text-sm text-gray-400">Project Progress</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">12</div>
                    <div className="text-sm text-gray-400">Tasks Completed</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-400">3</div>
                    <div className="text-sm text-gray-400">Pending Reviews</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Database Content */}
          {activeMainTab === "database" && (
            <div className="space-y-6">
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-5">
                <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Database Management
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <div className="font-medium">PostgreSQL</div>
                      <div className="text-sm text-gray-400">Primary database</div>
                    </div>
                    <div className="text-green-400">Connected</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <div className="font-medium">Redis Cache</div>
                      <div className="text-sm text-gray-400">Session storage</div>
                    </div>
                    <div className="text-green-400">Active</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Content */}
          {activeMainTab === "settings" && (
            <div className="space-y-6">
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-5">
                <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Project Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Auto-save</div>
                      <div className="text-sm text-gray-400">Automatically save changes</div>
                    </div>
                    <button className="bg-cyan-500/20 border border-cyan-500/50 rounded-full w-12 h-6 relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-cyan-400 rounded-full"></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Notifications</div>
                      <div className="text-sm text-gray-400">Enable push notifications</div>
                    </div>
                    <button className="bg-white/10 border border-white/20 rounded-full w-12 h-6 relative">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-gray-400 rounded-full"></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* App/Website Report Content - Only show when App or Website tabs are active */}
          {shouldShowReportTabs && (
            <>
              {activeReportTab === "summary" && (
                <div className="space-y-6">
                  {/* Project Overview */}
                  <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-5">
                    <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      Product Requirements Document (PRD)
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-medium text-white mb-2">1. Project Overview</h4>
                        <p className="text-gray-300 mb-3">{projectData?.description}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Role:</span>{" "}
                            <span className="text-white font-medium">
                              {projectData?.role
                                ? projectData.role.charAt(0).toUpperCase() + projectData.role.slice(1)
                                : "Not specified"}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Created:</span>{" "}
                            <span className="text-white font-medium">
                              {projectData?.timestamp
                                ? new Date(projectData.timestamp).toLocaleDateString()
                                : "Unknown"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Functional Requirements */}
                  <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-5">
                    <h4 className="text-lg font-medium text-white mb-3">2. Functional Requirements</h4>
                    <div className="space-y-3">
                      <div>
                        <h5 className="text-cyan-400 font-medium mb-2">Core Features</h5>
                        <ul className="text-gray-300 space-y-2">
                          <li className="flex items-start">
                            <ChevronRight className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0 mr-2" />
                            <span>AI-powered code generation and optimization</span>
                          </li>
                          <li className="flex items-start">
                            <ChevronRight className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0 mr-2" />
                            <span>Real-time collaboration and version control</span>
                          </li>
                          <li className="flex items-start">
                            <ChevronRight className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0 mr-2" />
                            <span>Automated testing and quality assurance</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeReportTab === "design" && (
                <div className="space-y-4 h-full flex flex-col">
                  <div className="flex-grow backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 overflow-hidden">
                    <div className="h-full bg-gradient-to-br from-slate-800/50 to-purple-800/50 rounded-lg relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                          <div className="text-4xl mb-2">🎨</div>
                          <p className="text-gray-400">AI-Powered UI Designer</p>
                          <p className="text-sm text-gray-500 mt-1">Drag, drop, and design with AI assistance</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeReportTab === "code" && (
                <div className="space-y-4 h-full flex flex-col">
                  <div className="flex-grow backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                    <div className="h-full bg-slate-900/80 relative">
                      <div className="p-4 h-full overflow-auto">
                        <pre className="text-sm text-gray-300 font-mono leading-6">
                          <code>
                            {`import React, { useState, useEffect } from 'react'

export default function ProjectComponent() {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState(null)

  return (
    <div className="project-container">
      <h1 className="text-2xl font-bold">Project Component</h1>
      {/* Project content here */}
    </div>
  )
}`}
                          </code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeReportTab === "resources" && (
                <div className="space-y-6">
                  <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-5">
                    <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      Resource Allocation
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center mr-3">
                            <Cpu className="w-5 h-5 text-cyan-400" />
                          </div>
                          <div>
                            <div className="font-medium">Compute Resources</div>
                            <div className="text-sm text-gray-400">8 vCPUs, 16GB RAM</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-cyan-400">$120/mo</div>
                          <div className="text-sm text-gray-400">Estimated</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeReportTab === "performance" && (
                <div className="space-y-6">
                  <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-5">
                    <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      Performance Metrics
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <div className="font-medium">Response Time</div>
                          <div className="text-sm text-gray-400">Average system response</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-cyan-400">120ms</div>
                          <div className="text-sm text-gray-400">Target: &lt;200ms</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}