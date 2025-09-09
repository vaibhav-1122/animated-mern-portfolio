"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface Skill {
  id: string;
  name: string;
  category: "Frontend" | "Backend" | "Databases" | "DevOps/Tools" | "Auth/Core Concepts/AI";
  icon: string;
  fallback: string;
}

const skills: Skill[] = [
  {
    id: "javascript",
    name: "JavaScript",
    category: "Frontend",
    icon: "/icons/javascript.svg",
    fallback: "JS"
  },
  {
    id: "react",
    name: "React",
    category: "Frontend",
    icon: "/icons/react.svg",
    fallback: "RE"
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "Frontend",
    icon: "/icons/typescript.svg",
    fallback: "TS"
  },
  {
    id: "html5",
    name: "HTML5",
    category: "Frontend",
    icon: "/icons/html5.svg",
    fallback: "H5"
  },
  {
    id: "css3",
    name: "CSS3",
    category: "Frontend",
    icon: "/icons/css3.svg",
    fallback: "C3"
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    category: "Frontend",
    icon: "/icons/tailwind.svg",
    fallback: "TW"
  },
  {
    id: "redux",
    name: "Redux",
    category: "Frontend",
    icon: "/icons/redux.svg",
    fallback: "RD"
  },
  {
    id: "nodejs",
    name: "Node.js",
    category: "Backend",
    icon: "/icons/nodejs.svg",
    fallback: "NO"
  },
  {
    id: "express",
    name: "Express.js",
    category: "Backend",
    icon: "/icons/express.svg",
    fallback: "EX"
  },
  {
    id: "socketio",
    name: "Socket.io",
    category: "Backend",
    icon: "/icons/socketio.svg",
    fallback: "SO"
  },
  {
    id: "mongodb",
    name: "MongoDB",
    category: "Databases",
    icon: "/icons/mongodb.svg",
    fallback: "MO"
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "Databases",
    icon: "/icons/postgresql.svg",
    fallback: "PG"
  },
  {
    id: "redis",
    name: "Redis",
    category: "Databases",
    icon: "/icons/redis.svg",
    fallback: "RD"
  },
  {
    id: "git",
    name: "Git",
    category: "DevOps/Tools",
    icon: "/icons/git.svg",
    fallback: "GT"
  },
  {
    id: "github",
    name: "GitHub Actions",
    category: "DevOps/Tools",
    icon: "/icons/github.svg",
    fallback: "GH"
  },
  {
    id: "vercel",
    name: "Vercel",
    category: "DevOps/Tools",
    icon: "/icons/vercel.svg",
    fallback: "VE"
  },
  {
    id: "webrtc",
    name: "WebRTC",
    category: "Auth/Core Concepts/AI",
    icon: "/icons/webrtc.svg",
    fallback: "WR"
  },
  {
    id: "jwt",
    name: "JWT",
    category: "Auth/Core Concepts/AI",
    icon: "/icons/jwt.svg",
    fallback: "JW"
  }
];

// Create multiple rows of skills for the banner effect
const skillRows = [
  skills.slice(0, 6),
  skills.slice(6, 12),
  skills.slice(12, 18)
];

export default function SkillsCloud() {
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection observer for performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Respect system preference for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setAnimationsEnabled(false);
    }

    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setAnimationsEnabled(false);
      }
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const handleSkillClick = (skillName: string) => {
    navigator.clipboard.writeText(skillName).then(() => {
      toast.success(`Copied "${skillName}" to clipboard`);
    });
  };

  return (
    <section ref={sectionRef} id="skills" className="py-20 bg-gray-900 overflow-hidden">
      <div className="container max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-heading font-bold text-white mb-4">Skills</h2>
          <p className="text-gray-400 text-lg mb-8">
            Technologies I work with
          </p>

          {/* Animation Toggle */}
          <div className="flex items-center justify-center gap-3">
            <span className="text-sm text-gray-400">Pause Animation</span>
            <Switch
              checked={!animationsEnabled}
              onCheckedChange={(checked) => setAnimationsEnabled(!checked)}
            />
          </div>
        </div>

        {/* Skills Banner Rows */}
        <div className="space-y-8">
          {skillRows.map((row, rowIndex) => (
            <div key={rowIndex} className="relative">
              <motion.div
                className="flex items-center gap-8"
                animate={
                  animationsEnabled && isVisible
                    ? {
                        x: rowIndex % 2 === 0 ? [0, -100] : [0, 100],
                      }
                    : {}
                }
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  width: "max-content",
                }}
              >
                {/* Duplicate the row content to create seamless loop */}
                {[...row, ...row, ...row].map((skill, index) => (
                  <motion.button
                    key={`${skill.id}-${index}`}
                    className="group flex items-center gap-4 px-6 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-xl transition-all duration-300 cursor-pointer flex-shrink-0"
                    onClick={() => handleSkillClick(skill.name)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Icon */}
                    <div className="w-10 h-10 flex items-center justify-center">
                      <img
                        src={skill.icon}
                        alt={`${skill.name} icon`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div 
                        className="w-full h-full hidden items-center justify-center text-sm font-bold text-gray-300 bg-gray-600 rounded-lg"
                        style={{ display: 'none' }}
                      >
                        {skill.fallback}
                      </div>
                    </div>

                    {/* Name */}
                    <span className="text-white font-medium text-lg group-hover:text-blue-400 transition-colors whitespace-nowrap">
                      {skill.name}
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            </div>
          ))}
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Click on any skill to copy its name
          </p>
        </div>
      </div>
    </section>
  );
}