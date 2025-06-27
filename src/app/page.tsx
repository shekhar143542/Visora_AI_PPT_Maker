"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import Link from "next/link";
import { BackgroundPaths } from "@/components/BackgroundPaths";
import { StarBorder } from "@/components/star-border";
import DisplayCard from "@/components/display-card";
import { Sparkles } from "lucide-react";
import { HeroScrollDemo } from "@/components/heroscrolldemo";
import { HeroDemo } from "@/components/lampdemo";
import { GoogleGeminiEffectDemo } from "@/components/effectdemo";
import { HoverButton } from "@/components/hover-button";
import { PricingBasic } from "@/components/Pricingcard";
import Image from "next/image";


const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: parallaxRef,
    offset: ["start end", "end start"]
  });

  const defaultCards = [
  {
    icon: <Sparkles className="size-4 text-orange-300" />,
    title: "Prompt to Deck",
    description: "Type your idea, get a full presentation",
    date: "Instantly",
    iconClassName: "text-orange-400",
    titleClassName: "text-orange-400",
    className:
      "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <Sparkles className="size-4 text-orange-300" />,
    title: "AI-Powered Slides",
    description: "Smart visuals, design & animation",
    date: "Built by Visora",
    iconClassName: "text-orange-400",
    titleClassName: "text-orange-400",
    className:
      "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <Sparkles className="size-4 text-orange-300" />,
    title: "Export & Share",
    description: "Download, share, or present live",
    date: "In one click",
    iconClassName: "text-orange-400",
    titleClassName: "text-orange-400",
    className:
      "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10",
  },
];

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 relative z-50">
        <div className="flex items-center space-x-2">
  <div className="w-8 h-8 relative rounded-full overflow-hidden bg-orange-300/40">
    <Image src="/visora.png" alt="Logo" fill className="object-cover" />
  </div>
  <span className="text-xl font-bold">Visora</span>
</div>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-orange-200/60 hover:text-orange-200/80 transition-colors">Home</a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a>
        </div>
        <Link href="/sign-in">
        <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
          Login
        </Button>
        </Link>
      </nav>

      {/* Hero Section with Animated Background */}
      <section className="relative px-6 py-20 text-center">
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
          <StarBorder>
        Create With AI
      </StarBorder>
        </div>
        
        <div className="max-w-4xl mx-auto mt-16 relative">
          <BackgroundPaths title="From A Prompt To A Presentation" />
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto mt-8"
          >
            Submit any prompt you can think of, pitch, AI will transform it into a presentation
            <br />
            with integrated art and animations mind-style. Learn more
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
             <Link href='/sign-in'>  
            
      <HoverButton>Get Started</HoverButton>
    
            </Link>
          </motion.div>
          {/* Scroll Animation Section - Visora AI Showcase */}


        </div>
      </section>
      <GoogleGeminiEffectDemo/>
      <div className="mt-0">
  <HeroScrollDemo />
</div>

      {/* Parallax Image Section */}
      <section ref={parallaxRef} className="relative h-screen overflow-hidden">
        <motion.div
          style={{ y, opacity }}
          className="absolute inset-0"
        >
          <div className="relative w-full h-full">
            <img
              src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
              alt="Parallax Background"
              className="w-full h-full object-cover"
            />
            {/* Fading overlays - 80% faded on sides and bottom */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-80"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-60"></div>
          </div>
        </motion.div>
        
        {/* Content overlay */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-4 text-white">
              Transform Ideas
            </h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Experience the power of AI-driven presentation creation
            </p>
          </motion.div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="relative px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {/* Left Panels */}
            <div className="space-y-4">
              <Card className="bg-gray-900 border-gray-800 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-400/60 rounded-full"></div>
                    <span className="text-sm text-gray-400">Palones</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-12 bg-orange-500/50 rounded"></div>
                  <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
              </Card>
              
              <Card className="bg-gray-900 border-gray-800 p-4">
                <div className="text-sm text-gray-400 mb-3">SUMARIES</div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-400/60 rounded-full"></div>
                    <div className="h-2 bg-gray-700 rounded flex-1"></div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-400/60 rounded-full"></div>
                    <div className="h-2 bg-gray-700 rounded flex-1"></div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-400/60 rounded-full"></div>
                    <div className="h-2 bg-gray-700 rounded flex-1"></div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Center Main Presentation - Single Interface */}
            <div className="relative">
              <div className="bg-gradient-to-br from-amber-800/70 to-amber-900/50 rounded-lg p-8 aspect-[4/3] flex flex-col justify-between relative overflow-hidden border border-orange-400/20">
                {/* Top Navigation */}
                <div className="flex justify-between items-center">
                  <span className="text-white text-sm font-medium">How to Phaker Strategy</span>
                  <div className="flex items-center space-x-3">
                    <button className="text-white/80 hover:text-white">←</button>
                    <button className="text-white/80 hover:text-white">→</button>
                    <button className="bg-white/90 text-black px-3 py-1 rounded text-sm font-medium">Share</button>
                  </div>
                </div>
                
                {/* Main Content */}
                <div className="text-center text-white flex-1 flex flex-col justify-center">
                  <h2 className="text-3xl font-bold mb-4 leading-tight">Go to: Market<br />Strategy</h2>
                  <p className="text-sm text-white/80 mb-6 max-w-xs mx-auto">
                    A presentation to hire a top-skilled<br />
                    website developer inside.
                  </p>
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
                    <div className="w-8 h-8 bg-white rounded-full"></div>
                  </div>
                </div>
                
                {/* Bottom Indicators */}
                <div className="flex justify-center">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                    <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                  </div>
                </div>

                {/* Fading overlay effects */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 via-transparent to-orange-400/10 pointer-events-none"></div>
              </div>
              
              {/* Prospect Summary with fading and shadow effects */}
              <div className="mt-12 text-center relative">
                <div className="relative">
                  <h3 className="text-4xl font-bold mb-6 text-white/20 relative">
                    Prospect Summary
                    <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-white/20 bg-clip-text text-transparent">
                      Prospect Summary
                    </div>
                  </h3>
                  {/* Bottom shadow effect */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-full h-8 bg-gradient-to-b from-orange-400/20 to-transparent blur-lg"></div>
                </div>
                <div className="flex justify-center space-x-12 text-sm text-gray-500 mt-4">
                  <span>Palones 1</span>
                  <span>Palones 2</span>
                  <span>Palones 3</span>
                </div>
              </div>
            </div>

            {/* Right Panels */}
            <div className="space-y-4">
              <Card className="bg-gray-900 border-gray-800 p-4">
                <div className="text-sm text-gray-400 mb-3">Payeeders</div>
                <div className="grid grid-cols-3 gap-2">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="h-8 bg-orange-500/50 rounded"></div>
                  ))}
                </div>
              </Card>
              
              <Card className="bg-gray-900 border-gray-800 p-4">
                <div className="text-sm text-gray-400 mb-3">Applications</div>
                <div className="grid grid-cols-2 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-700 rounded"></div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Display Cards Section - Highlighted Features */}
<section className="px-6 py-20 bg-black text-white">
  <div className="max-w-6xl mx-auto text-center mb-16">
    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
      Power in Simplicity
    </h2>
    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
      Visora AI helps you go from a simple idea to a polished presentation in seconds.
    </p>
  </div>

  <div className="flex items-center justify-center">
    <div className="w-full max-w-4xl">
      <DisplayCard cards={defaultCards} />
    </div>
  </div>
</section>
<section className="relative z-10 -mb-24 mt-40">
  <HeroDemo />
</section>


      {/* Pricing Section */}
     <section className="relative z-0 px-6 py-20 overflow-visible">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
           
          </div>
        </div>
        <PricingBasic/>
        {/* Bottom fade effect */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
      </section>
    </div>
    
  );
};

export default Index;
