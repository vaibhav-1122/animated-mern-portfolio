import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import HeaderHero from "@/components/HeaderHero";
import SkillsCloud from "@/components/SkillsCloud";
import ProjectsShowcase from "@/components/ProjectsShowcase";
import ContactFooter from "@/components/ContactFooter";
import "./globals.css";

export default function Home() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-background text-foreground">
        <HeaderHero />
        
        <main className="space-y-24">
          <SkillsCloud />
          <ProjectsShowcase />
        </main>
        
        <ContactFooter />
        
        <Toaster 
          position="bottom-right"
          toastOptions={{
            className: "bg-card border-border",
          }}
        />
      </div>
    </ThemeProvider>
  );
}