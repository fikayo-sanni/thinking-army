import { motion } from 'framer-motion';
import { Brain, Target, Sparkles, Workflow, Users, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Small Agents',
    description: 'Entry-level AI workflows for specific business processes, starting at €50/month. Perfect for automating routine tasks.',
    color: '#00B28C',
  },
  {
    icon: Target,
    title: 'Big Sales',
    description: 'Enterprise-grade AI transformation solutions for comprehensive sales automation and optimization.',
    color: '#6F00FF',
  },
  {
    icon: Sparkles,
    title: 'Meta-Agent',
    description: 'AI-driven needs assessment and continuous optimization suggestions to maximize your return on investment.',
    color: '#297EFF',
  },
  {
    icon: Workflow,
    title: 'Custom Workflows',
    description: 'Build and customize AI-powered workflows tailored to your specific business needs and processes.',
    color: '#FF6B6B',
  },
  {
    icon: Users,
    title: 'Team Integration',
    description: 'Seamlessly integrate AI agents with your existing team structure and business operations.',
    color: '#FFA500',
  },
  {
    icon: TrendingUp,
    title: 'Measurable Impact',
    description: 'Track and measure the direct impact of AI automation on your business metrics and bottom line.',
    color: '#2AC769',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-[#F8F9FB] dark:bg-[#1A2B45]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#202124] dark:text-[#E6E6E6] mb-4">
            AI-Powered Success
          </h2>
          <p className="text-lg text-[#5F6368] dark:text-[#A0A0A0] max-w-2xl mx-auto">
            From small businesses to enterprise solutions, our AI agents deliver instant, measurable value across every industry and process.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white dark:bg-[#1E1E1E] rounded-lg p-6 border border-[#E4E6EB] dark:border-[#2A2A2A] hover:border-[#297EFF] dark:hover:border-[#4D8DFF] transition-all duration-300 hover:shadow-lg"
            >
              <div 
                className="mb-4 p-3 rounded-lg w-fit transition-colors"
                style={{ 
                  backgroundColor: `${feature.color}20`,
                }}
              >
                <feature.icon 
                  className="w-6 h-6"
                  style={{ color: feature.color }}
                />
              </div>
              <h3 className="text-xl font-semibold text-[#202124] dark:text-[#E6E6E6] mb-2">
                {feature.title}
              </h3>
              <p className="text-[#5F6368] dark:text-[#A0A0A0]">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 