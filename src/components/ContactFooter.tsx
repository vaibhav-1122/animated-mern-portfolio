"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Send, CircleCheckBig, Contact, MessageSquare, Forward } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

interface ContactFooterProps {
  onSubmit?: (data: FormData) => Promise<void>;
  submitEndpoint?: string;
  className?: string;
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  interests: string[];
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const interestOptions = [
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "realtime", label: "Real-time" },
  { id: "devops", label: "DevOps" },
  { id: "ai", label: "AI" },
];

const socialLinks = [
  { label: "GitHub", href: "#", icon: Contact },
  { label: "LinkedIn", href: "#", icon: Contact },
  { label: "Twitter", href: "#", icon: Contact },
];

const quickInfo = [
  { label: "Email", value: "hello@example.com" },
  { label: "Location", value: "Remote / PST" },
  { label: "Status", value: "Available for hire" },
];

export default function ContactFooter({
  onSubmit,
  submitEndpoint = "/api/contact",
  className = "",
}: ContactFooterProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
    interests: [],
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastSubmit, setLastSubmit] = useState<number | null>(null);
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 20) {
      newErrors.message = "Message must be at least 20 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const handleInterestChange = useCallback((interestId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      interests: checked
        ? [...prev.interests, interestId]
        : prev.interests.filter(id => id !== interestId)
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Check rate limit (5 minutes)
    const now = Date.now();
    if (lastSubmit && now - lastSubmit < 5 * 60 * 1000) {
      const remainingTime = Math.ceil((5 * 60 * 1000 - (now - lastSubmit)) / 1000 / 60);
      toast.error(`Please wait ${remainingTime} minutes before sending another message`);
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Default API call
        const response = await fetch(submitEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) throw new Error("Failed to send message");
      }
      
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
      
      toast.success("Message sent — I'll reply within 2 days", {
        description: "Thank you for reaching out!",
      });
      
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        interests: [],
      });
      
      setLastSubmit(now);
    } catch (error) {
      toast.error("Failed to send message", {
        description: "Please try again or contact me directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, lastSubmit, onSubmit, submitEndpoint]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const getRemainingCooldown = useCallback(() => {
    if (!lastSubmit) return null;
    const now = Date.now();
    const elapsed = now - lastSubmit;
    const cooldown = 5 * 60 * 1000; // 5 minutes
    if (elapsed < cooldown) {
      const remaining = Math.ceil((cooldown - elapsed) / 1000 / 60);
      return remaining;
    }
    return null;
  }, [lastSubmit]);

  return (
    <section id="contact" className={`bg-card border-t ${className}`}>
      <div className="container max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Let's build something
          </h2>
          <p className="text-xl text-muted-foreground">
            Ready for collaboration? Let's discuss your next project.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 mb-16">
          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name *
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={errors.name ? "border-destructive" : ""}
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p role="alert" className="text-sm text-destructive mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={errors.email ? "border-destructive" : ""}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p role="alert" className="text-sm text-destructive mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <Input
                  id="subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  placeholder="Project discussion"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message * <span className="text-muted-foreground text-xs">(min 20 characters)</span>
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  className={`min-h-[120px] ${errors.message ? "border-destructive" : ""}`}
                  placeholder="Tell me about your project, goals, and how I can help..."
                />
                {errors.message && (
                  <p role="alert" className="text-sm text-destructive mt-1">
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Interest Areas */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Areas of Interest
                </label>
                <div className="flex flex-wrap gap-4">
                  {interestOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.id}
                        checked={formData.interests.includes(option.id)}
                        onCheckedChange={(checked) => 
                          handleInterestChange(option.id, checked === true)
                        }
                      />
                      <label 
                        htmlFor={option.id}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto relative"
              >
                <AnimatePresence mode="wait">
                  {isSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center gap-2"
                    >
                      <CircleCheckBig className="w-4 h-4" />
                      Sent!
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Send className={`w-4 h-4 ${isSubmitting ? "animate-pulse" : ""}`} />
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>

              {/* Rate Limit Notice */}
              {getRemainingCooldown() && (
                <p className="text-sm text-muted-foreground">
                  Next message available in {getRemainingCooldown()} minutes
                </p>
              )}
            </form>

            {/* Privacy Notice */}
            <div className="mt-6 text-xs text-muted-foreground">
              <Dialog open={showPrivacyDialog} onOpenChange={setShowPrivacyDialog}>
                <DialogTrigger asChild>
                  <button className="underline hover:text-foreground transition-colors">
                    Privacy & Data Policy
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Privacy & Data</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 text-sm">
                    <p>
                      Your information is used solely to respond to your inquiry and is never shared with third parties.
                    </p>
                    <p>
                      We store your message temporarily and delete it after our conversation concludes.
                    </p>
                    <p>
                      No tracking, no analytics, no spam. Just human-to-human communication.
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Contact Info & Social */}
          <div className="space-y-8">
            {/* Quick Contact Info */}
            <div>
              <h3 className="text-lg font-heading font-semibold mb-4 flex items-center gap-2">
                <Contact className="w-5 h-5" />
                Quick Contact
              </h3>
              <div className="space-y-3">
                {quickInfo.map((info, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                    <span className="text-sm text-muted-foreground">{info.label}</span>
                    <span className="text-sm font-medium">{info.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-heading font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Connect
              </h3>
              <div className="flex gap-4">
                {socialLinks.map((link, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    asChild
                    className="hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <a 
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Connect on ${link.label}`}
                    >
                      <link.icon className="w-4 h-4 mr-2" />
                      {link.label}
                    </a>
                  </Button>
                ))}
              </div>
            </div>

            {/* Quick Badges */}
            <div className="flex flex-wrap gap-3">
              <div className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
                <span className="text-xs font-medium">📄 Resume Available</span>
              </div>
              <div className="px-3 py-1 bg-green-50 border border-green-200 rounded-full">
                <span className="text-xs font-medium">🟢 Available Now</span>
              </div>
              <div className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">
                <span className="text-xs font-medium">⚡ Fast Response</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-6">
            <p>&copy; 2024 Your Name. All rights reserved.</p>
            <a 
              href="#"
              className="hover:text-foreground transition-colors underline"
            >
              Resume
            </a>
          </div>
          
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 hover:text-foreground transition-colors group"
            aria-label="Back to top"
          >
            <span className="text-xs">Back to top</span>
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut"
              }}
              className="motion-reduce:animate-none"
            >
              <Forward className="w-4 h-4 -rotate-90" />
            </motion.div>
          </button>
        </div>
      </div>
    </section>
  );
}