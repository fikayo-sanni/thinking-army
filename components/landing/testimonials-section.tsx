import { motion } from 'framer-motion';
import { Star, Clock, TrendingUp, DollarSign } from 'lucide-react';

const testimonials = [
  {
    company: 'TechCorp Solutions',
    industry: 'Software Development',
    agentType: 'Small Agent - Social Content',
    logo: '/logos/techcorp.svg',
    quote: 'The AI agent completely transformed our social media presence. What used to take our team 20 hours per week is now automated with better engagement.',
    results: {
      metric: '300%',
      label: 'Increase in engagement',
    },
    timeframe: '2 months',
    savings: '€24,000 annually',
    author: {
      name: 'Sarah Chen',
      role: 'Marketing Director',
    },
  },
  {
    company: 'Global Logistics Inc',
    industry: 'Transportation',
    agentType: 'Big Sales - Corporate Funnel',
    logo: '/logos/globallogistics.svg',
    quote: 'Implementing the Big Sales solution revolutionized our lead generation and customer onboarding. The ROI was evident within weeks.',
    results: {
      metric: '€2.1M',
      label: 'Additional revenue',
    },
    timeframe: '6 months',
    savings: '€180,000 annually',
    author: {
      name: 'Marcus Rodriguez',
      role: 'Sales Director',
    },
  },
  {
    company: 'EduTech Academy',
    industry: 'Education',
    agentType: 'Small Agent - Education',
    logo: '/logos/edutech.svg',
    quote: 'The Education Agent helped us create personalized learning paths for over 500 students. The impact on student engagement has been remarkable.',
    results: {
      metric: '40%',
      label: 'Improvement in completion rates',
    },
    timeframe: '3 months',
    savings: '€36,000 annually',
    author: {
      name: 'Dr. Emma Thompson',
      role: 'Academic Director',
    },
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-white dark:bg-[#1E1E1E]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#202124] dark:text-[#E6E6E6] mb-4">
            Success Stories
          </h2>
          <p className="text-lg text-[#5F6368] dark:text-[#A0A0A0] max-w-2xl mx-auto">
            See how businesses across industries are achieving measurable results with our AI agents.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.company}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#F8F9FB] dark:bg-[#1A2B45] rounded-xl p-8 border border-[#E4E6EB] dark:border-[#2A2A2A] hover:border-[#297EFF] dark:hover:border-[#4D8DFF] transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-[#202124] dark:text-[#E6E6E6]">
                    {testimonial.company}
                  </h3>
                  <p className="text-sm text-[#5F6368] dark:text-[#A0A0A0]">
                    {testimonial.industry}
                  </p>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 text-[#297EFF] dark:text-[#4D8DFF] fill-current"
                    />
                  ))}
                </div>
              </div>

              <div className="mb-6 p-4 bg-[#297EFF]/5 dark:bg-[#4D8DFF]/5 rounded-lg">
                <p className="text-sm font-medium text-[#297EFF] dark:text-[#4D8DFF]">
                  {testimonial.agentType}
                </p>
              </div>

              <blockquote className="mb-6 text-[#202124] dark:text-[#E6E6E6]">
                "{testimonial.quote}"
              </blockquote>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#297EFF] dark:text-[#4D8DFF]" />
                  <div>
                    <p className="text-lg font-semibold text-[#202124] dark:text-[#E6E6E6]">
                      {testimonial.results.metric}
                    </p>
                    <p className="text-xs text-[#5F6368] dark:text-[#A0A0A0]">
                      {testimonial.results.label}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#297EFF] dark:text-[#4D8DFF]" />
                  <div>
                    <p className="text-lg font-semibold text-[#202124] dark:text-[#E6E6E6]">
                      {testimonial.timeframe}
                    </p>
                    <p className="text-xs text-[#5F6368] dark:text-[#A0A0A0]">
                      Time to results
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="w-5 h-5 text-[#297EFF] dark:text-[#4D8DFF]" />
                <p className="text-sm text-[#202124] dark:text-[#E6E6E6]">
                  Cost savings: <span className="font-semibold">{testimonial.savings}</span>
                </p>
              </div>

              <div className="pt-6 border-t border-[#E4E6EB] dark:border-[#2A2A2A]">
                <p className="font-medium text-[#202124] dark:text-[#E6E6E6]">
                  {testimonial.author.name}
                </p>
                <p className="text-sm text-[#5F6368] dark:text-[#A0A0A0]">
                  {testimonial.author.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 