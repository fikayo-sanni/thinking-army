import { motion } from 'framer-motion';
import { Star, Coins, Gamepad2, Blocks, TrendingUp, Gem } from 'lucide-react';

const features = [
  {
    icon: Star,
    title: 'Stars as NFTs',
    description: 'Generate elements through staking with our innovative star NFTs, functioning like real stars to create valuable building blocks.',
  },
  {
    icon: Blocks,
    title: 'Elemental Building Blocks',
    description: 'Transform digital assets into elemental parts, breaking down boundaries between game worlds and creating infinite possibilities.',
  },
  {
    icon: Coins,
    title: 'GamesCoin Currency',
    description: 'Access the gaming economy with GamesCoin, our in-game currency designed to power the future of gaming transactions.',
  },
  {
    icon: Gamepad2,
    title: 'True Ownership',
    description: 'Take control as a gamer with true ownership of your games, digital assets, and in-game achievements.',
  },
  {
    icon: TrendingUp,
    title: 'Growing Market',
    description: 'Join a market larger than film, music, and sports combined, with 2.7 billion people spending over $300 billion annually.',
  },
  {
    icon: Gem,
    title: 'Crypto Integration',
    description: 'Experience the perfect match between gaming and crypto assets, positioned for the upcoming bull run in gaming tokens.',
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
            The Essence of Success
          </h2>
          <p className="text-lg text-[#5F6368] dark:text-[#A0A0A0] max-w-2xl mx-auto">
            Gaming is at a turning point in its history. Gamers are being put at the center of power, creating unprecedented opportunities in the world's largest economy.
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
              <div className="mb-4 p-3 rounded-lg bg-[#297EFF]/10 dark:bg-[#4D8DFF]/10 w-fit group-hover:bg-[#297EFF]/20 dark:group-hover:bg-[#4D8DFF]/20 transition-colors">
                <feature.icon className="w-6 h-6 text-[#297EFF] dark:text-[#4D8DFF]" />
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