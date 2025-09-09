"use client";

import { useState, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Menu, IdCard, Sun, Moon } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface HeaderHeroProps {
  className?: string;
}

export default function HeaderHero({ className }: HeaderHeroProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentJobTitle, setCurrentJobTitle] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const jobTitles = [
    "MERN Stack Developer",
    "Real-time Apps", 
    "APIs"
  ];

  const springConfig = { damping: 25, stiffness: 400 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((event.clientX - centerX) / rect.width);
    mouseY.set((event.clientY - centerY) / rect.height);
  }, [mouseX, mouseY]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentJobTitle((prev) => (prev + 1) % jobTitles.length);
    }, 3000);

    const timeoutId = setTimeout(() => {
      clearInterval(interval);
    }, 15000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleNavClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    { label: "Skills", href: "skills" },
    { label: "Projects", href: "projects" },
    { label: "Contact", href: "contact" }
  ];

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div id="hero" className={`relative min-h-screen bg-background ${className}`}>
      {/* Navigation */}
      <motion.nav 
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <IdCard className="h-6 w-6 text-accent" />
            <span className="font-heading font-bold text-lg">Portfolio</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
              >
                {item.label}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="relative h-9 w-9 p-0 rounded-full border border-border hover:bg-accent/10 transition-all duration-300"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={false}
                  animate={{
                    scale: theme === 'dark' ? 0 : 1,
                    rotate: theme === 'dark' ? 180 : 0,
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <Sun className="h-4 w-4 text-amber-500" />
                </motion.div>
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={false}
                  animate={{
                    scale: theme === 'dark' ? 1 : 0,
                    rotate: theme === 'dark' ? 0 : -180,
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <Moon className="h-4 w-4 text-blue-400" />
                </motion.div>
              </Button>
            </motion.div>

            {/* Resume Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <Button 
                variant="outline" 
                size="sm"
                className="hidden sm:inline-flex border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              >
                Resume
              </Button>
            </motion.div>

            {/* Mobile Menu */}
            <Dialog open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xs">
                <div className="flex flex-col space-y-4 py-4">
                  {navItems.map((item) => (
                    <button
                      key={item.href}
                      onClick={() => handleNavClick(item.href)}
                      className="text-left px-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-4 px-2">
                      <span className="text-sm font-medium">Dark Mode</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleTheme}
                        className="h-8 w-8 p-0 rounded-full"
                      >
                        {theme === 'dark' ? (
                          <Moon className="h-4 w-4" />
                        ) : (
                          <Sun className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Resume
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div className="container max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8 order-2 lg:order-1">
            <div className="space-y-4">
              <motion.h1 
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Hello, I'm{" "}
                <span className="text-accent">Alex Johnson</span>
              </motion.h1>
              
              <motion.div 
                className="h-12 flex items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <motion.h2 
                  key={currentJobTitle}
                  className="text-xl sm:text-2xl font-semibold text-muted-foreground"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {jobTitles[currentJobTitle]}
                </motion.h2>
              </motion.div>

              <motion.p 
                className="text-lg text-muted-foreground max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                Building modern, scalable web applications with cutting-edge technologies and intuitive user experiences.
              </motion.p>
            </div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
              <Button 
                size="lg" 
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => handleNavClick('projects')}
              >
                View Projects
              </Button>
              <Button variant="outline" size="lg">
                Download Resume
              </Button>
            </motion.div>
          </div>

          {/* Right Column - Profile Card */}
          <div className="flex justify-center lg:justify-end order-1 lg:order-2">
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => {
                mouseX.set(0);
                mouseY.set(0);
              }}
              style={{
                transformStyle: "preserve-3d",
                rotateX,
                rotateY,
              }}
            >
              {/* Background Card Layers */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl transform rotate-2 scale-105 blur-sm" />
              <div className="absolute inset-0 bg-card rounded-2xl transform -rotate-1 scale-102 shadow-lg" />
              
              {/* Main Profile Card */}
              <div className="relative bg-card/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-border/50">
                {/* Neon Accent Lines */}
                <div className="absolute top-4 left-4 w-8 h-0.5 bg-accent rounded-full" />
                <div className="absolute top-4 right-4 w-8 h-0.5 bg-accent rounded-full" />
                <div className="absolute bottom-4 left-4 w-8 h-0.5 bg-accent rounded-full" />
                <div className="absolute bottom-4 right-4 w-8 h-0.5 bg-accent rounded-full" />

                {/* Avatar and Content */}
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div className="relative">
                    <Avatar className="w-32 h-32 border-4 border-accent/20">
                      <AvatarImage 
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" 
                        alt="Alex Johnson"
                      />
                      <AvatarFallback className="text-2xl font-bold bg-accent text-accent-foreground">
                        AJ
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Animated Spotlight */}
                    <motion.div
                      className="absolute -inset-4 bg-gradient-radial from-accent/30 to-transparent rounded-full opacity-0"
                      animate={{
                        opacity: [0, 0.6, 0],
                        scale: [0.8, 1.2, 0.8],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold">Alex Johnson</h3>
                    <p className="text-muted-foreground">Full Stack Developer</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm text-muted-foreground">Available for work</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}