// components/Navbar.tsx
import { useState, useEffect } from "react"
import { ChevronDown, Menu, X } from "lucide-react"
import Link from "next/link"

export default function Navbar() {
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
    <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Ashwatth Engineer
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href={'/'} className="hover:text-cyan-400 transition-colors">
            Home
          </Link>
          <button onClick={() => scrollToSection("features")} className="hover:text-cyan-400 transition-colors">
            Features
          </button>
          
          <button onClick={() => scrollToSection("cta")} className="hover:text-cyan-400 transition-colors">
            Contact
          </button>
          <Link href={'projects'}  className="bg-gradient-to-r from-cyan-500 to-purple-500 px-6 py-2 rounded-full hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300">
            Projects
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-4 space-y-4 container mx-auto px-6">
          <button onClick={() => scrollToSection("features")} className="block hover:text-cyan-400 transition-colors">
            Features
          </button>
          <Link href={'projects'} className="block hover:text-cyan-400 transition-colors">
            Projects
          </Link>
          <button onClick={() => scrollToSection("cta")} className="block hover:text-cyan-400 transition-colors">
            Contact
          </button>
          <button className="bg-gradient-to-r from-cyan-500 to-purple-500 px-6 py-2 rounded-full">
            Request Demo
          </button>
        </div>
      )}
    </header>
  )
}
