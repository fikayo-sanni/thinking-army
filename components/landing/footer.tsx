import { motion } from 'framer-motion';

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
            <img
              src="/logo-dark-mode.svg"
              alt="GC Universe Logo"
              className="h-8 w-auto hidden dark:block mb-4"
            />
            <img
              src="/logo-light-mode.svg"
              alt="GC Universe Logo"
              className="h-8 w-auto dark:hidden mb-4"
            />
            <p className="text-[#5F6368] dark:text-[#A0A0A0] max-w-md">
              Those who spot trends early will benefit. At GC Universe, we recognised the gaming revolution early and created the key to this gateway: GamesCoin and the building blocks of an incredible economy.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-sm font-semibold text-[#202124] dark:text-[#E6E6E6] uppercase tracking-wider mb-4">
              Universe
            </h3>
            <ul className="space-y-2">
              {[
                'Star NFTs',
                'Elements',
                'GamesCoin',
                'Trading Platform',
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
              Resources
            </h3>
            <ul className="space-y-2">
              {[
                'How to Join',
                'Documentation',
                'Gaming Economy',
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
          className="mt-12 pt-8 border-t border-[#E4E6EB] dark:border-[#2A2A2A] flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <p className="text-[#5F6368] dark:text-[#A0A0A0] text-sm">
            © {currentYear} GC Universe. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <a href="/terms" className="text-[#5F6368] dark:text-[#A0A0A0] text-sm hover:text-[#297EFF] dark:hover:text-[#4D8DFF] transition-colors">
              Terms of Service
            </a>
            <a href="/privacy" className="text-[#5F6368] dark:text-[#A0A0A0] text-sm hover:text-[#297EFF] dark:hover:text-[#4D8DFF] transition-colors">
              Privacy Policy
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
} 