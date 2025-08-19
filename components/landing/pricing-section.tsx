'use client';

import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const plans = [
  {
    name: 'Small Agents',
    description: 'Entry-level AI workflows for specific business processes',
    price: {
      setup: '€500',
      monthly: '€50',
    },
    features: [
      'Single business process automation',
      '30-day Mission Report',
      'Measurable KPI tracking',
      'Basic integrations',
      'Email support',
      'ROI analytics',
    ],
    highlight: false,
    cta: 'Start with Small Agent',
  },
  {
    name: 'Big Sales',
    description: 'Complete enterprise-grade AI transformation solution',
    price: {
      total: '€20,000',
    },
    features: [
      'Multi-channel marketing automation',
      'Advanced analytics dashboard',
      'Full CRM integration',
      'Custom workflow builder',
      'Priority 24/7 support',
      'Dedicated success manager',
    ],
    highlight: true,
    cta: 'Schedule Consultation',
  },
];

export function PricingSection() {
  return (
    <section className="py-24 bg-white ">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#202124] dark:text-[#E6E6E6] mb-4">
            Choose Your Growth Path
          </h2>
          <p className="text-lg text-[#5F6368] dark:text-[#A0A0A0] max-w-2xl mx-auto">
            Start with a Small Agent and scale up as your success grows, or transform your entire operation with our enterprise solution.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-xl p-8 ${
                plan.highlight
                  ? 'bg-[#297EFF] dark:bg-[#4D8DFF] text-white'
                  : 'bg-[#F8F9FB] dark:bg-[#1A2B45] text-[#202124] dark:text-[#E6E6E6] border border-[#E4E6EB] dark:border-[#2A2A2A]'
              }`}
            >
              <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
              <p className={`text-sm mb-6 ${
                plan.highlight ? 'text-white/90' : 'text-[#5F6368] dark:text-[#A0A0A0]'
              }`}>
                {plan.description}
              </p>
              
              <div className="mb-8">
                {plan.price.total ? (
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">{plan.price.total}</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-baseline mb-2">
                      <span className="text-4xl font-bold">{plan.price.setup}</span>
                      <span className={`ml-2 ${
                        plan.highlight ? 'text-white/90' : 'text-[#5F6368] dark:text-[#A0A0A0]'
                      }`}>setup</span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="text-2xl font-bold">{plan.price.monthly}</span>
                      <span className={`ml-2 ${
                        plan.highlight ? 'text-white/90' : 'text-[#5F6368] dark:text-[#A0A0A0]'
                      }`}>/month care plan</span>
                    </div>
                  </div>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${
                      plan.highlight ? 'text-white' : 'text-[#297EFF] dark:text-[#4D8DFF]'
                    }`} />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full h-12 group ${
                  plan.highlight
                    ? 'bg-white hover:bg-white/90 text-[#297EFF]'
                    : 'bg-[#297EFF] hover:bg-[#1D6FFF] text-white'
                } font-medium rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-[#5F6368] dark:text-[#A0A0A0] max-w-2xl mx-auto">
            All plans include the Meta-Agent for needs assessment and optimization recommendations.
            Enterprise solutions can be customized based on your specific requirements.
          </p>
        </motion.div>
      </div>
    </section>
  );
} 