"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Zap, Cpu, Cog, Code, Beaker, Shield, ArrowRight, Play, Menu, X } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/utils/Navbar"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
       <Navbar />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative pt-20">
        <div className="container mx-auto px-6 text-center">
          <div
            className="transform transition-all duration-1000"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                The Future of
              </span>
              <br />
              <span className="text-white">Engineering</span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
              Transform your engineering workflows with AI-powered automation. From design to deployment, we
              revolutionize how engineering gets done.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href={'/projects'} className="group bg-gradient-to-r from-cyan-500 to-purple-500 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 flex items-center gap-2">
                Start Your AI Journey
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="group border border-white/20 backdrop-blur-sm px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-2">
                <Play className="group-hover:scale-110 transition-transform" />
                Watch Demo
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => scrollToSection("features")}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
        >
          <ChevronDown className="w-8 h-8 text-cyan-400" />
        </button>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Engineering Domains
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our AI automates complex engineering tasks across all major disciplines, delivering unprecedented speed
              and accuracy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Code className="w-8 h-8" />,
                title: "Software Engineering",
                description: "Automated code generation, testing frameworks, and software architecture optimization.",
              },
              {
                icon: <Cog className="w-8 h-8" />,
                title: "Structural Engineering",
                description:
                  "Automated building analysis, blueprint generation, and structural optimization with AI-driven insights.",
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Electrical Systems",
                description:
                  "Intelligent circuit design, power optimization, and electrical system automation for maximum efficiency.",
              },
              {
                icon: <Cpu className="w-8 h-8" />,
                title: "Mechanical Design",
                description:
                  "CAD automation, thermal analysis, and mechanical system optimization powered by advanced AI.",
              },

              {
                icon: <Beaker className="w-8 h-8" />,
                title: "Process Engineering",
                description: "Chemical process optimization, safety analysis, and automated process control systems.",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Quality Assurance",
                description: "Automated testing protocols, defect prediction, and quality control optimization.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl backdrop-blur-sm bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="text-cyan-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-cyan-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="stats" className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Proven Results
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "10x", label: "Faster Design Cycles", suffix: "" },
              { number: "95", label: "Error Reduction", suffix: "%" },
              { number: "60", label: "Cost Savings", suffix: "%" },
              { number: "24/7", label: "Automated Operations", suffix: "" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-2xl backdrop-blur-sm bg-white/5 border border-white/10"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    {stat.number}
                    {stat.suffix}
                  </span>
                </div>
                <p className="text-gray-300 text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="cta" className="py-20 relative">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto p-12 rounded-3xl backdrop-blur-sm bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {" "}
                Engineering?
              </span>
            </h2>

            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of engineers who have revolutionized their workflows with AI automation. Start your
              transformation today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group bg-gradient-to-r from-cyan-500 to-purple-500 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center gap-2">
                Start Free Trial
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border border-white/20 backdrop-blur-sm px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all duration-300">
                Schedule Consultation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="text-center mb-16 px-4">
          <h2 className="font-bold mb-6 text-[12vw] leading-none whitespace-nowrap inline-block max-w-full truncate">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Ashwatth Labs
            </span>
          </h2>
        </div>

        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">
            © 2024 Ashwatth Engineer AI. All rights reserved. Transforming engineering with artificial intelligence.
          </p>
        </div>
      </footer>
    </div>
  )
}
