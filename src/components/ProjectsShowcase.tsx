"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Eye, Search, ChevronLeft, ChevronRight, Play, Copy } from "lucide-react";
import { toast } from "sonner";

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: "web-apps" | "real-time" | "api" | "ai";
  tags: string[];
  image: string;
  screenshots: string[];
  demo?: string;
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
  date: string;
}

const mockProjects: Project[] = [
  {
    id: "1",
    title: "Real-time Chat Platform",
    description: "A scalable chat application with WebSocket support and real-time messaging",
    longDescription: "Built a comprehensive real-time chat platform featuring WebSocket connections, message persistence, user presence indicators, and file sharing capabilities. The application supports multiple chat rooms, direct messaging, and emoji reactions with a modern, responsive interface.",
    category: "real-time",
    tags: ["React", "Node.js", "Socket.io", "MongoDB", "TypeScript"],
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop"
    ],
    liveUrl: "https://example.com",
    repoUrl: "https://github.com/example/chat-platform",
    featured: true,
    date: "2024-01-15"
  },
  {
    id: "2",
    title: "E-commerce Dashboard",
    description: "Analytics dashboard for e-commerce platforms with advanced data visualization",
    longDescription: "Comprehensive e-commerce analytics dashboard featuring interactive charts, real-time sales tracking, inventory management, and customer insights. Built with modern React patterns and optimized for performance with large datasets.",
    category: "web-apps",
    tags: ["React", "D3.js", "PostgreSQL", "Express", "Redis"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop"
    ],
    liveUrl: "https://example.com",
    repoUrl: "https://github.com/example/dashboard",
    featured: false,
    date: "2023-12-20"
  },
  {
    id: "3",
    title: "AI Content Generator",
    description: "Machine learning powered content generation tool with natural language processing",
    longDescription: "Advanced AI-powered content generation platform leveraging GPT models and custom fine-tuning. Features include content optimization, SEO suggestions, tone adjustment, and multi-format output generation with real-time preview.",
    category: "ai",
    tags: ["Python", "OpenAI", "FastAPI", "React", "TensorFlow"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop"
    ],
    liveUrl: "https://example.com",
    repoUrl: "https://github.com/example/ai-generator",
    featured: true,
    date: "2024-02-10"
  },
  {
    id: "4",
    title: "RESTful API Gateway",
    description: "Microservices API gateway with authentication, rate limiting, and monitoring",
    longDescription: "Enterprise-grade API gateway built for microservices architecture. Features include JWT authentication, rate limiting, request/response transformation, monitoring dashboard, and automatic service discovery with health checks.",
    category: "api",
    tags: ["Node.js", "Express", "Redis", "Docker", "Kubernetes"],
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop"
    ],
    liveUrl: "https://example.com",
    repoUrl: "https://github.com/example/api-gateway",
    featured: false,
    date: "2023-11-05"
  },
  {
    id: "5",
    title: "Task Management App",
    description: "Collaborative project management tool with real-time updates and team features",
    longDescription: "Full-featured project management application with drag-and-drop task boards, team collaboration tools, time tracking, and comprehensive reporting. Built with modern web technologies and real-time synchronization across team members.",
    category: "web-apps",
    tags: ["Next.js", "Supabase", "TypeScript", "Tailwind", "Framer Motion"],
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop"
    ],
    liveUrl: "https://example.com",
    repoUrl: "https://github.com/example/task-manager",
    featured: true,
    date: "2024-03-01"
  }
];

const categories = [
  { value: "all", label: "All" },
  { value: "web-apps", label: "Web Apps" },
  { value: "real-time", label: "Real-time" },
  { value: "api", label: "API" },
  { value: "ai", label: "AI" }
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "relevant", label: "Most Relevant" }
];

export default function ProjectsShowcase() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentScreenshot, setCurrentScreenshot] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = mockProjects;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort projects
    filtered.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      // Most relevant: featured first, then by date
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return filtered;
  }, [selectedCategory, searchQuery, sortBy]);

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setCurrentScreenshot(0);
  };

  const handleCopyRepoUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Repository URL copied to clipboard");
  };

  const nextScreenshot = () => {
    if (selectedProject) {
      setCurrentScreenshot((prev) => 
        prev === selectedProject.screenshots.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevScreenshot = () => {
    if (selectedProject) {
      setCurrentScreenshot((prev) => 
        prev === 0 ? selectedProject.screenshots.length - 1 : prev - 1
      );
    }
  };

  if (isLoading) {
    return (
      <section id="projects" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold mb-4">Featured Projects</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A showcase of my recent work and technical projects.
            </p>
          </div>

          {/* Loading Skeleton */}
          <div className="space-y-8">
            {/* Controls Skeleton */}
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 w-20 bg-muted rounded-md animate-pulse" />
                ))}
              </div>
              <div className="flex gap-4">
                <div className="h-10 w-64 bg-muted rounded-md animate-pulse" />
                <div className="h-10 w-32 bg-muted rounded-md animate-pulse" />
              </div>
            </div>

            {/* Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-video bg-muted animate-pulse" />
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded animate-pulse mb-3" />
                    <div className="h-4 bg-muted rounded animate-pulse mb-4" />
                    <div className="flex flex-wrap gap-2 mb-4">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="h-6 w-16 bg-muted rounded-full animate-pulse" />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <div className="h-9 w-20 bg-muted rounded animate-pulse" />
                      <div className="h-9 w-20 bg-muted rounded animate-pulse" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-heading font-bold mb-4">Featured Projects</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A showcase of my recent work and technical projects, ranging from web applications to AI-powered solutions.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between mb-12">
          {/* Filter Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full lg:w-auto">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:flex">
              {categories.map((category) => (
                <TabsTrigger key={category.value} value={category.value} className="text-sm">
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Search and Sort */}
          <div className="flex gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects or tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          {filteredAndSortedProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto">
                <div className="h-16 w-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No projects found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search terms to find what you're looking for.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence>
                {filteredAndSortedProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: index * 0.1 }
                    }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ y: -8 }}
                    className="group"
                  >
                    <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg relative">
                      {project.featured && (
                        <div className="absolute top-4 right-4 z-10">
                          <Badge className="bg-accent text-accent-foreground">
                            Featured
                          </Badge>
                        </div>
                      )}

                      <div className="aspect-video bg-muted overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>

                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {project.description}
                        </p>

                        {/* Tech Tags */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {project.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{project.tags.length - 3} more
                            </Badge>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {project.liveUrl && (
                            <Button
                              size="sm"
                              onClick={() => window.open(project.liveUrl, '_blank')}
                              className="flex-1"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Live
                            </Button>
                          )}
                          {project.repoUrl && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(project.repoUrl, '_blank')}
                              className="flex-1"
                            >
                              <Github className="h-4 w-4 mr-2" />
                              Code
                            </Button>
                          )}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleProjectSelect(project)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Details
                              </Button>
                            </DialogTrigger>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Project Details Modal */}
        {selectedProject && (
          <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-heading">
                  {selectedProject.title}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Screenshot Carousel */}
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={selectedProject.screenshots[currentScreenshot]}
                    alt={`${selectedProject.title} screenshot ${currentScreenshot + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {selectedProject.screenshots.length > 1 && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={prevScreenshot}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={nextScreenshot}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      
                      {/* Screenshot indicators */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {selectedProject.screenshots.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentScreenshot(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === currentScreenshot ? 'bg-accent' : 'bg-background/50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-lg font-semibold mb-3">About this project</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedProject.longDescription}
                  </p>
                </div>

                {/* Technologies */}
                <div>
                  <h4 className="text-lg font-semibold mb-3">Technologies Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Demo Section */}
                {selectedProject.demo && (
                  <div>
                    <h4 className="text-lg font-semibold mb-3">Live Demo</h4>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <Button variant="outline" size="lg">
                        <Play className="h-5 w-5 mr-2" />
                        Play Demo
                      </Button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t">
                  {selectedProject.liveUrl && (
                    <Button
                      onClick={() => window.open(selectedProject.liveUrl, '_blank')}
                      className="flex-1"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Live Site
                    </Button>
                  )}
                  {selectedProject.repoUrl && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(selectedProject.repoUrl, '_blank')}
                      className="flex-1"
                    >
                      <Github className="h-4 w-4 mr-2" />
                      View Repository
                    </Button>
                  )}
                  {selectedProject.repoUrl && (
                    <Button
                      variant="outline"
                      onClick={() => handleCopyRepoUrl(selectedProject.repoUrl!)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </section>
  );
}