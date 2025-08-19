import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, Sparkles, Target } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = ev;
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = (clientX - left) / width;
      const y = (clientY - top) / height;
      
      containerRef.current.style.setProperty('--mouse-x', `${x}`);
      containerRef.current.style.setProperty('--mouse-y', `${y}`);
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden bg-gradient-radial from-[#F8F9FB] to-white dark:from-[#1A2B45] dark:to-[#1E1E1E]"
      style={{ 
        '--mouse-x': '0.5',
        '--mouse-y': '0.5'
      } as React.CSSProperties}
    >
      {/* Background gradient that follows mouse */}
      <div 
        className="absolute inset-0 opacity-50 dark:opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle at calc(var(--mouse-x) * 100%) calc(var(--mouse-y) * 100%), rgba(41, 126, 255, 0.15), transparent 50%)`
        }}
      />

      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-[#202124] dark:text-[#E6E6E6] mb-6 tracking-tight">
              Your Business,{' '}
              <span className="text-[#297EFF] dark:text-[#4D8DFF]">
                AI Powered
              </span>
            </h1>
            <p className="text-xl text-[#5F6368] dark:text-[#A0A0A0] max-w-2xl mx-auto">
              From entry-level AI workflows to enterprise-grade solutions, Thinking Army delivers instant, measurable value across industries.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/onboarding">
              <Button
                className="h-12 px-8 bg-[#297EFF] hover:bg-[#1D6FFF] text-white font-medium text-lg rounded-lg flex items-center gap-2 group transition-all duration-300 hover:scale-105"
              >
                Get Started
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button
              variant="outline"
              className="h-12 px-8 border-[#E4E6EB] dark:border-[#2A2A2A] text-[#202124] dark:text-[#E6E6E6] font-medium text-lg hover:bg-[#F8F9FB] dark:hover:bg-[#1A2B45] rounded-lg transition-all duration-300 hover:scale-105"
              onClick={() => window.open('https://docs.thinking-army.com', '_blank')}
            >
              Learn More
            </Button>
          </motion.div>

          {/* Floating cards effect */}
          <div className="relative mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 perspective-1000">
            {[
              { 
                title: 'Small Agents',
                value: '€50/mo',
                description: 'Entry-level AI workflows',
                icon: Brain,
                color: '#00B28C'
              },
              { 
                title: 'Big Sales',
                value: 'Enterprise',
                description: 'Comprehensive solutions',
                icon: Target,
                color: '#6F00FF'
              },
              { 
                title: 'Meta-Agent',
                value: 'Included',
                description: 'AI-driven optimization',
                icon: Sparkles,
                color: '#297EFF'
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="bg-white  border border-[#E4E6EB] dark:border-[#2A2A2A] p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}20` }}>
                    <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                  <h3 className="text-lg font-semibold text-[#202124] dark:text-[#E6E6E6]">
                    {stat.title}
                  </h3>
                </div>
                <div className="text-2xl font-bold mb-1" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <p className="text-[#5F6368] dark:text-[#A0A0A0]">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 