import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-[#1E1E1E] border-t border-[#E4E6EB] dark:border-[#2A2A2A]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="col-span-1 md:col-span-2"
          >
            <h2 className="text-2xl font-bold text-[#202124] dark:text-[#E6E6E6] mb-4">
              Thinking Army
            </h2>
            <p className="text-[#5F6368] dark:text-[#A0A0A0] max-w-md mb-6">
              Delivering instant, measurable value across industries through ready-to-use AI agents and a scalable network marketing model.
            </p>
            <div className="space-y-3">
              <a href="mailto:contact@thinkingarmy.com" className="flex items-center gap-2 text-[#5F6368] dark:text-[#A0A0A0] hover:text-[#297EFF] dark:hover:text-[#4D8DFF] transition-colors">
                <Mail className="w-5 h-5" />
                contact@thinkingarmy.com
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-2 text-[#5F6368] dark:text-[#A0A0A0] hover:text-[#297EFF] dark:hover:text-[#4D8DFF] transition-colors">
                <Phone className="w-5 h-5" />
                +1 (234) 567-890
              </a>
              <div className="flex items-center gap-2 text-[#5F6368] dark:text-[#A0A0A0]">
                <MapPin className="w-5 h-5" />
                Global Headquarters
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-sm font-semibold text-[#202124] dark:text-[#E6E6E6] uppercase tracking-wider mb-4">
              Solutions
            </h3>
            <ul className="space-y-2">
              {[
                'Small Agents',
                'Big Sales',
                'Meta-Agent',
                'Custom Workflows',
                'Success Stories',
                'Pricing',
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-[#5F6368] dark:text-[#A0A0A0] hover:text-[#297EFF] dark:hover:text-[#4D8DFF] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-sm font-semibold text-[#202124] dark:text-[#E6E6E6] uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              {[
                'About Us',
                'Partner Program',
                'Documentation',
                'API Reference',
                'Security',
                'Contact',
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-[#5F6368] dark:text-[#A0A0A0] hover:text-[#297EFF] dark:hover:text-[#4D8DFF] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 pt-8 border-t border-[#E4E6EB] dark:border-[#2A2A2A]"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex items-center space-x-4">
              {[Linkedin, Twitter, Facebook].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="p-2 rounded-full bg-[#F8F9FB] dark:bg-[#1A2B45] text-[#5F6368] dark:text-[#A0A0A0] hover:text-[#297EFF] dark:hover:text-[#4D8DFF] transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            <div className="flex items-center space-x-6">
              <a href="/terms" className="text-[#5F6368] dark:text-[#A0A0A0] text-sm hover:text-[#297EFF] dark:hover:text-[#4D8DFF] transition-colors">
                Terms of Service
              </a>
              <a href="/privacy" className="text-[#5F6368] dark:text-[#A0A0A0] text-sm hover:text-[#297EFF] dark:hover:text-[#4D8DFF] transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-[#5F6368] dark:text-[#A0A0A0] text-sm">
              © {currentYear} Thinking Army. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
} 