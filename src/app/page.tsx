"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Code,
  Menu,
  X,
  ChevronDown,
  Download,
  Calendar,
  MapPin,
  Send,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Image from "next/image";
import  HeroScene  from "@/components/3dHeroScene"


// Image Modal Component
function ImageModal({
  isOpen,
  onClose,
  screenshots,
  initialIndex = 0,
  projectTitle,
}: {
  isOpen: boolean
  onClose: () => void
  screenshots: string[]
  initialIndex?: number
  projectTitle: string
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length)
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev + 1) % screenshots.length)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose, screenshots.length])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % screenshots.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative z-10 w-full h-full max-w-7xl max-h-screen p-2 sm:p-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-2 sm:mb-4 px-2 sm:px-0">
          <div>
            <h3 className="text-lg sm:text-2xl font-bold text-white">{projectTitle}</h3>
            <p className="text-sm sm:text-base text-gray-400">
              {currentIndex + 1} of {screenshots.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 p-2 rounded-full bg-gray-800/50 hover:bg-gray-800 transition-all duration-300"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Image Container */}
        <div className="flex-1 relative flex items-center justify-center px-2 sm:px-0">
          <Image
            src={screenshots[currentIndex] || "/placeholder.svg"}
            alt={`${projectTitle} screenshot ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            height={4000}
            width={4000}
          />

          {/* Navigation Arrows */}
          {screenshots.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-1 sm:left-4 top-1/2 transform -translate-y-1/2 bg-gray-900/80 hover:bg-gray-900 text-white p-2 sm:p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
              >
                <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-1 sm:right-4 top-1/2 transform -translate-y-1/2 bg-gray-900/80 hover:bg-gray-900 text-white p-2 sm:p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
              >
                <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Strip */}
        {screenshots.length > 1 && (
          <div className="mt-2 sm:mt-4 flex justify-center space-x-1 sm:space-x-2 overflow-x-auto pb-2 px-2 sm:px-0">
            {screenshots.map((screenshot, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-16 h-10 sm:w-20 sm:h-12 rounded-md overflow-hidden border-2 transition-all duration-300 ${
                  index === currentIndex
                    ? "border-purple-400 opacity-100"
                    : "border-gray-600 opacity-60 hover:opacity-80"
                }`}
              >
                <Image
                  src={screenshot || "/placeholder.svg"}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  height={250}
                  width={250}
                />
              </button>
            ))}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-2 sm:mt-4 text-center text-gray-400 text-xs sm:text-sm px-2">
          <span className="hidden sm:inline">Use arrow keys or click arrows to navigate • Press ESC to close</span>
          <span className="sm:hidden">Tap arrows to navigate • Tap outside to close</span>
        </div>
      </div>
    </div>
  )
}

// Screenshot Carousel Component
function ScreenshotCarousel({
  screenshots,
  onImageClick,
}: {
  screenshots: string[]
  projectTitle: string
  onImageClick: (index: number) => void
}) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % screenshots.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length)
  }

  if (screenshots.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-t-lg h-48 bg-gray-700/50 flex items-center justify-center">
        <Code className="w-12 h-12 text-gray-500" />
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-t-lg h-48 group">
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {screenshots.map((screenshot, index) => (
          <Image
            key={index}
            src={screenshot || "/placeholder.svg"}
            alt={`Screenshot ${index + 1}`}
            className="w-full h-full object-cover flex-shrink-0 group-hover:scale-110 transition-transform duration-500 cursor-pointer"
            onClick={() => onImageClick(index)}
            height={250}
            width={250}
          />
        ))}
      </div>

      {screenshots.length > 1 && (
        <>
          {/* Navigation Buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              prevSlide()
            }}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-900/80 hover:bg-gray-900 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm z-10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              nextSlide()
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-900/80 hover:bg-gray-900 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm z-10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {screenshots.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentIndex(index)
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-purple-400" : "bg-gray-400/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function Portfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [projectFilter, setProjectFilter] = useState("all")
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    screenshots: string[]
    initialIndex: number
    projectTitle: string
  }>({
    isOpen: false,
    screenshots: [],
    initialIndex: 0,
    projectTitle: "",
  })

  const projects = [
    {
      title: "NSWG1 Recruitment Platform & Internal Management Tool",
      description:
        "A full-stack Next.js application built for the Naval Special Warfare Group One community. It combines a recruitment hub with an internal management system featuring Discord OAuth2 login, role-based access control, attendance tracking, real-time communication, and Perscom API integration.",
      screenshots: [
        "/images/nswg1-website/nswg1-website-homepage.png",
        "/images/nswg1-website/nswg1-website-admin-homepage.png",
        "/images/nswg1-website/nswg1-website-attendance.png",
        "/images/nswg1-website/nswg1-website-profile.png",
        "/images/nswg1-website/nswg1-website-admin-applications.png",
        "/images/nswg1-website/nswg1-website-attendance-calendar.png",
        "/images/nswg1-website/nswg1-website-roster.png"

      ],
      technologies: [
        "Next.js",
        "React",
        "TypeScript",
        "NextAuth.js",
        "MySQL",
        "Prisma",
        "Socket.io",
        "Tailwind CSS"
      ],
      github: "https://github.com/Almightyluccas/NSWG1-Website",
      live: "https://nswg1.org",
      category: "fullstack",
      featured: true,
    },
    {
      title: "Laravel E-commerce Website with StockX Integration",
      description:
        "An e-commerce platform built with Laravel and PHP, featuring product listings populated by images and data scraped from StockX. The site supports user-friendly browsing, product management, and order processing, backed by a robust MySQL database.",
      screenshots: [
        "/images/ecommerce/ecommerce-homepage.png",
        "/images/ecommerce/ecommerce-productPage.png",
        "/images/ecommerce/ecommerce-shoppage.png",
        "/images/ecommerce/ecommerce-profile.png"
      ],
      technologies: [
        "Laravel",
        "PHP",
        "MySQL",
        "Goutte (web scraping)",
        "Bootstrap",
        "Composer"
      ],
      github: "https://github.com/Almightyluccas/Sneaker-Ecommerce",
      live: "https://sneaker-ecommerce-master-63o9kp.laravel.cloud/",
      category: "fullstack",
      featured: true,
    },
    {
      title: "NSWG1 Discord Attendance & Recruitment Bot",
      description:
        "A Discord bot featuring an attendance system that pulls data from a database to display user attendance calendars directly in Discord. It includes application notifications to recruiters for new submissions, and updates on application status (accepted or denied). Users can also send messages through the bot, either as embeds or regular text messages.",
      screenshots: [
        "/images/nswg1-bot/nswg1-bot-calendar.png",
        "/images/nswg1-bot/nswg1-bot-newApplication.png",
        "/images/nswg1-bot/nswg1-bot-accepted.png",
        "/images/nswg1-bot/nswg1-bot-event.png",
        "/images/nswg1-bot/nswg1-bot-create-message.png",
      ],
      technologies: [
        "Node.js",
        "Discord.js",
        "TypeScript",
        "MySQL",
      ],
      github: "https://github.com/Almightyluccas/NSWG1-Discord-Bot",
      live: "https://github.com/Almightyluccas/NSWG1-Discord-Bot",
      category: "backend",
      featured: true,
    },
    {
      title: "NSWG1 Server Web Scraper",
      description:
        "A TypeScript application providing real-time monitoring and analytics for NSWG1 game server activity. Features include player session tracking, raid schedule management, secure AES encryption for sensitive data, and MySQL integration for persistent storage. Built with clean architecture principles and deployed on Heroku. Made to be used with Discord Bot",
      screenshots: [
        "/images/nswg1-scraper/nswg1-webscraper.png",
      ],
      technologies: [
        "TypeScript",
        "Node.js",
        "MySQL",
        "Puppeteer",
        "Luxon",
        "crypto-js",
        "Heroku"
      ],
      github: "https://github.com/Almightyluccas/NSWG1-Web-Scraper",
      live: "https://github.com/Almightyluccas/NSWG1-Discord-Bot",
      category: "backend",
      featured: true,
    },

  ]

  const experience = [
    {
      title: "Software Engineer",
      company: "NearAbl",
      period: "June 2024 - Current",
      location: "New York, NY",
      description:
        "Spearheading the development of 3D model processing and visualization tools, delivering scalable backend systems and intuitive user experiences.",
      responsibilities: [
        "Engineered and deployed a high-performance GLTF export queue system (TypeScript, React), achieving a 10× efficiency boost via parallel processing.",
        "Designed and implemented a dynamic UI component tree for granular selection in GLTF exports.",
        "Delivered GLTF to USDZ conversion for iOS using Python (Lambda-Flask), AWS Lambda, Docker, and TypeScript.",
        "Reduced storage costs by creating a delta comparison system in C# to manage 3D model revisions in Amazon S3.",
        "Upgraded backend authentication in C# to align with modern security best practices.",
        "Currently building a 3D model visualization dashboard (Three.js, TypeScript, React) for viewing schematics, tracking progress, exporting components, and enabling real-time annotations.",
      ],
      technologies: ["TypeScript", "React", "Node.js", "Python (Flask)", "C#", "PostgreSQL", "AWS", "AWS Lambda", "Amazon S3", "Docker", "Three.js"],
    },
  ]

  const techStack = {
    programmingLanguages: [
      { name: "JavaScript", icon: "🟡" },
      { name: "TypeScript", icon: "🔷" },
      { name: "Python", icon: "🐍" },
      { name: "PHP", icon: "🐘" },
      { name: "C#", icon: "🎵" },
      { name: "Go (Golang)", icon: "🐹" },
    ],
    frontendDevelopment: [
      { name: "React", icon: "⚛️" },
      { name: "Next.js", icon: "▲" },
      { name: "Vue.js", icon: "💚" }, // Highly sought after
      { name: "HTML", icon: "📄" },
      { name: "CSS", icon: "💅" },
      { name: "Tailwind CSS", icon: "🎨" },
      { name: "Bootstrap", icon: "🅱️" },
    ],
    backendDevelopment: [
      { name: "Node.js", icon: "🟢" },
      { name: "Laravel", icon: "✨" }, // Crucial for PHP roles
      { name: "Django", icon: "🎼" }, // Crucial for Python roles
      { name: "Flask", icon: "🍶" },
      { name: "FastAPI", icon: "⚡" },
      { name: "GraphQL", icon: "💜" },
    ],
    databases: [
      { name: "PostgreSQL", icon: "🐘" },
      { name: "MongoDB", icon: "🍃" },
      { name: "MySQL", icon: "🐬" },
      { name: "Redis", icon: "🔴" },
      { name: "SQL Server", icon: "💾" }, // Important for C#/.NET stack
    ],
    cloudAndDevOps: [
      { name: "AWS", icon: "☁️" },
      { name: "Docker", icon: "🐳" },
      { name: "Kubernetes", icon: "☸️" },
      { name: "GitHub Actions", icon: "🔄" }, // CI/CD
      { name: "Nginx", icon: "🌐" }, // Web server/reverse proxy
    ],
  }

  const filteredProjects = projects.filter((project) => projectFilter === "all" || project.category === projectFilter)

  const openModal = (screenshots: string[], initialIndex: number, projectTitle: string) => {
    setModalState({
      isOpen: true,
      screenshots,
      initialIndex,
      projectTitle,
    })
  }

  const closeModal = () => {
    setModalState({
      isOpen: false,
      screenshots: [],
      initialIndex: 0,
      projectTitle: "",
    })
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    element?.scrollIntoView({ behavior: "smooth" })
    setActiveSection(sectionId)
    setIsMenuOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "projects", "experience", "techstack", "contact"]
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {"{ Luccas.Portfolio }"}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {[
                { id: "home", label: "Home" },
                { id: "about", label: "About" },
                { id: "projects", label: "Projects" },
                { id: "experience", label: "Experience" },
                { id: "techstack", label: "Tech Stack" },
                { id: "contact", label: "Contact" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-all duration-300 hover:text-purple-400 relative ${
                    activeSection === item.id ? "text-purple-400" : "text-gray-300"
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400" />
                  )}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-800/50">
              <div className="flex flex-col space-y-4 mt-4">
                {[
                  { id: "home", label: "Home" },
                  { id: "about", label: "About" },
                  { id: "projects", label: "Projects" },
                  { id: "experience", label: "Experience" },
                  { id: "techstack", label: "Tech Stack" },
                  { id: "contact", label: "Contact" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-left text-lg font-medium transition-colors py-2 px-4 rounded-lg ${
                      activeSection === item.id ? "text-purple-400 bg-purple-400/10" : "text-gray-300 hover:text-purple-400 hover:bg-gray-800/50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <HeroScene />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/10 to-gray-950/80 z-10" />

        <div className="relative z-20 text-center px-4 sm:px-6 max-w-5xl mx-auto">
          <div className="mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Luccas Amorim
            </h1>
            <p className="text-lg sm:text-2xl md:text-3xl text-gray-300 mb-4 sm:mb-6 font-light px-4">Backend-Focused Full-Stack Developer</p>
            <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
              Crafting robust, scalable backend systems and elegant user experiences. Specialized in Node.js,
              TypeScript, and modern cloud architectures.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              onClick={() => scrollToSection("projects")}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold px-10 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25"
            >
              View My Work
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("contact")}
              className="border-2 border-purple-400/50 text-purple-400 hover:bg-purple-400/10 font-semibold px-10 py-4 rounded-full transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
            >
              Get In Touch
            </Button>
          </div>

          <div className="flex justify-center space-x-6 sm:space-x-8 mt-12 sm:mt-16">
            <a
              href="https://github.com/Almightyluccas"
              target="_blank" rel="noreferrer noopener"
              className="text-gray-400 hover:text-purple-400 transition-all duration-300 transform hover:scale-110 p-2"
            >
              <Github className="w-6 h-6 sm:w-7 sm:h-7" />
            </a>
            <a
              href="https://www.linkedin.com/in/luccas-a-6b2473279/"
              target="_blank" rel="noreferrer noopener"
              className="text-gray-400 hover:text-cyan-400 transition-all duration-300 transform hover:scale-110 p-2"
            >
              <Linkedin className="w-6 h-6 sm:w-7 sm:h-7" />
            </a>
            <a
              href="mailto:lamorim7657@outlook.com"
              target="_blank" rel="noreferrer noopener"
              className="text-gray-400 hover:text-purple-400 transition-all duration-300 transform hover:scale-110 p-2"
            >
              <Mail className="w-6 h-6 sm:w-7 sm:h-7" />
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 to-gray-900" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <h2 className="text-5xl font-bold text-center mb-20 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            About Me
          </h2>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
              <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
                A full-stack developer with a strong focus on backend architecture and system design.
                With a year of work experience, I’ve built scalable, high-performance applications using Node.js, TypeScript, React, PostgreSQL, and Docker.
              </p>
              <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
                I also create intuitive interfaces with React and modern CSS frameworks.
                I&apos;m particularly passionate about microservices, API design, and DevOps practices.
                I enjoy exploring new technologies, and optimizing database performance.
              </p>

              <div className="flex flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-8">
                {["Node.js", "TypeScript", "PostgreSQL", "Docker", "React", "TailwindCSS"].map((tech) => (
                  <Badge
                    key={tech}
                    className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="relative order-1 lg:order-2">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-3xl backdrop-blur-sm border border-purple-500/20 shadow-2xl shadow-purple-500/10" />
                <div className="absolute inset-4 sm:inset-6 bg-gray-800/50 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Image
                    src="/images/thumbnail_IMG_4963.jpg"
                    alt="Professional Photo"
                    width={384}
                    height={384}
                    className="object-cover w-full h-full"
                  />

                </div>
                <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full animate-pulse" />
                <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full animate-pulse delay-1000" />
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-950" />
        <div className="container mx-auto max-w-7xl relative z-10">
          <h2 className="text-5xl font-bold text-center mb-20 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Featured Projects
          </h2>

          {/* Project Filter */}
          <div className="flex justify-center mb-12 sm:mb-16 px-4">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-full p-1 sm:p-2 border border-gray-700/50 w-full max-w-md sm:max-w-none sm:w-auto">
              <div className="flex space-x-1 sm:space-x-2">
                {[
                  { id: "all", label: "All Projects" },
                  { id: "backend", label: "Backend" },
                  { id: "fullstack", label: "Full Stack" },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setProjectFilter(filter.id)}
                    className={`px-3 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 flex-1 sm:flex-none ${
                      projectFilter === filter.id
                        ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg"
                        : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((project, index) => (
              <Card
                key={index}
                className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/50 transition-all duration-500 group hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative">
                  <ScreenshotCarousel
                    screenshots={project.screenshots}
                    projectTitle={project.title}
                    onImageClick={(index) => openModal(project.screenshots, index, project.title)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  {project.featured && (
                    <Badge className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg z-10">
                      Featured
                    </Badge>
                  )}
                  <Badge className="absolute top-4 right-4 bg-gray-900/80 text-gray-300 backdrop-blur-sm z-10">
                    {project.category === "backend" ? "Backend" : "Full Stack"}
                  </Badge>
                </div>

                <CardHeader className="relative z-10">
                  <CardTitle className="text-white group-hover:text-purple-400 transition-colors duration-300 text-xl">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400 leading-relaxed">{project.description}</CardDescription>
                </CardHeader>

                <CardContent className="relative z-10">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-colors duration-300 text-xs"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex space-x-3">

                      <Button
                        asChild={true}
                        size="sm"
                        variant="outline"
                        className="border-purple-400/50 text-purple-400 hover:bg-purple-400/10 transition-all duration-300 flex-1"
                      >
                        <a href={project.github} target="_blank" rel="noreferrer noopener">
                        <Github className="w-4 h-4 mr-2" />
                        Code
                        </a>
                      </Button>

                      <Button
                        asChild={true}
                        size="sm"
                        className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white transition-all duration-300 flex-1"
                      >
                        <a href={project.live} target="_blank" rel="noreferrer noopener">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Demo
                        </a>
                      </Button>


                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 to-gray-900" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <h2 className="text-5xl font-bold text-center mb-20 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Experience
          </h2>

          <div className="text-center mb-16">
            <Button
              asChild={true}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold px-10 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25"
            >
              <a href={"/resume/ResumeLuccas.pdf"} download>
                <Download className="w-5 h-5 mr-2" />
                Download Resume
              </a>
            </Button>
          </div>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-400 to-cyan-400" />

            <div className="space-y-12">
              {experience.map((exp, index) => (
                <div key={index} className="relative flex items-start space-x-8">
                  <div className="flex-shrink-0 w-4 h-4 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full relative z-10" />

                  <Card className="flex-1 bg-gray-800/30 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
                    <CardHeader>
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                        <div>
                          <CardTitle className="text-white text-2xl mb-2">{exp.title}</CardTitle>
                          <CardDescription className="text-purple-400 font-semibold text-xl">
                            {exp.company}
                          </CardDescription>
                        </div>
                        <div className="flex flex-col lg:items-end space-y-2 mt-4 lg:mt-0">
                          <div className="flex items-center text-gray-400">
                            <Calendar className="w-4 h-4 mr-2" />
                            {exp.period}
                          </div>
                          <div className="flex items-center text-gray-400">
                            <MapPin className="w-4 h-4 mr-2" />
                            {exp.location}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-300 text-lg leading-relaxed">{exp.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-white font-semibold mb-4 text-lg">Key Responsibilities:</h4>
                          <ul className="space-y-3">
                            {exp.responsibilities.map((responsibility, idx) => (
                              <li key={idx} className="text-gray-300 flex items-start">
                                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                                {responsibility}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-white font-semibold mb-4 text-lg">Technologies Used:</h4>
                          <div className="flex flex-wrap gap-2">
                            {exp.technologies.map((tech) => (
                              <Badge
                                key={tech}
                                className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 text-sm"
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="techstack" className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-950" />
        <div className="container mx-auto max-w-7xl relative z-10">
          <h2 className="text-5xl font-bold text-center mb-20 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Tech Stack
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
            {Object.entries(techStack).map(([category, technologies]) => (
              <Card
                key={category}
                className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10"
              >
                <CardHeader>
                  <CardTitle className="text-white text-xl sm:text-2xl text-center capitalize bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    {category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {technologies.map((tech) => (
                      <div
                        key={tech.name}
                        className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-all duration-300 group"
                      >
                        <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-300">
                          {tech.icon}
                        </span>
                        <span className="text-white font-medium text-sm">{tech.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 to-gray-900" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <h2 className="text-5xl font-bold text-center mb-20 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Let&apos;s Connect
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16">
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-4 sm:mb-6">Get In Touch</h3>
                <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-6 sm:mb-8">
                  I&apos;m always interested in discussing new opportunities, innovative projects, or just connecting with
                  fellow developers. Whether you have a question about my work or want to collaborate, I&apos;d love to hear
                  from you!
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-purple-500/20 to-cyan-500/20 p-3 sm:p-4 rounded-xl backdrop-blur-sm border border-purple-500/20">
                    <a href="mailto:lamorim7657@outlook.com">
                      <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                    </a>

                  </div>
                  <div>
                    <p className="text-white font-semibold text-base sm:text-lg">Email</p>
                    <p className="text-gray-400 text-sm sm:text-base">lamorim7657@outlook.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-purple-500/20 to-cyan-500/20 p-3 sm:p-4 rounded-xl backdrop-blur-sm border border-purple-500/20">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-base sm:text-lg">Location</p>
                    <p className="text-gray-400 text-sm sm:text-base">New York, NY</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 sm:space-x-6 pt-6 sm:pt-8 justify-center lg:justify-start">
                <a
                  href="https://github.com/Almightyluccas"
                  target="_blank" rel="noreferrer noopener"
                  className="bg-gradient-to-br from-purple-500/20 to-cyan-500/20 p-3 sm:p-4 rounded-xl hover:from-purple-500/30 hover:to-cyan-500/30 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm border border-purple-500/20"
                >
                  <Github className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                </a>
                <a
                  href="https://www.linkedin.com/in/luccas-a-6b2473279/"
                  target="_blank" rel="noreferrer noopener"
                  className="bg-gradient-to-br from-purple-500/20 to-cyan-500/20 p-3 sm:p-4 rounded-xl hover:from-purple-500/30 hover:to-cyan-500/30 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm border border-purple-500/20"
                >
                  <Linkedin className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                </a>
                <a
                  href="mailto:lamorim7657@outlook.com"
                  target="_blank" rel="noreferrer noopener"
                  className="bg-gradient-to-br from-purple-500/20 to-cyan-500/20 p-3 sm:p-4 rounded-xl hover:from-purple-500/30 hover:to-cyan-500/30 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm border border-purple-500/20"
                >
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                </a>
              </div>
            </div>

            <Card className="bg-gray-800/30 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
              <CardHeader>
                <CardTitle className="text-white text-xl sm:text-2xl">Send a Message</CardTitle>
                <CardDescription className="text-gray-400 text-base sm:text-lg">
                  Fill out the form below and I&apos;ll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300 font-medium text-sm sm:text-base">
                      Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Your full name"
                      className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20 h-10 sm:h-12 text-sm sm:text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300 font-medium text-sm sm:text-base">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20 h-10 sm:h-12 text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-gray-300 font-medium text-sm sm:text-base">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    placeholder="What's this about?"
                    className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20 h-10 sm:h-12 text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-gray-300 font-medium text-sm sm:text-base">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Tell me about your project or just say hello..."
                    rows={5}
                    className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20 resize-none text-sm sm:text-base"
                  />
                </div>

                <Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold py-3 sm:py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25 text-sm sm:text-base">
                  <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-950 border-t border-gray-800/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {"{ Luccas.Portfolio }"}
            </div>
            <p className="text-gray-400 text-lg">
              Built with Next.js, Three.js, TypeScript, and a passion for clean code
            </p>
            <div className="flex justify-center space-x-8">
              <a href="https://github.com/Almightyluccas" className="text-gray-500 hover:text-purple-400 transition-colors duration-300 " target="_blank" rel="noreferrer noopener">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/in/luccas-a-6b2473279/" className="text-gray-500 hover:text-cyan-400 transition-colors duration-300" target="_blank" rel="noreferrer noopener">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="mailto:lamorim7657@outlook.com" className="text-gray-500 hover:text-purple-400 transition-colors duration-300" target="_blank" rel="noreferrer noopener">
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <p className="text-gray-600 text-sm">© 2025 Luccas Amorim. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Image Modal */}
      <ImageModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        screenshots={modalState.screenshots}
        initialIndex={modalState.initialIndex}
        projectTitle={modalState.projectTitle}
      />
    </div>
)
}
