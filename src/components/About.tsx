"use client";

import { motion } from "framer-motion";
import {
  Home,
  Users,
  Shield,
  Heart,
  Flower,
  Clock,
  Star,
  Zap,
  CheckCircle,
  ArrowRight,
  MapPin,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: <Home size={32} />,
    title: "Comfortable Living",
    description:
      "Stylish, spacious rooms designed specifically for women's comfort and privacy.",
    color: "from-orange-500 to-yellow-500",
    stats: "100%",
    statLabel: "Comfort Rated",
  },
  {
    icon: <Shield size={32} />,
    title: "Enhanced Security",
    description: "Dedicated 24/7 security and CCTV surveillance.",
    color: "from-yellow-500 to-orange-500",
    stats: "24/7",
    statLabel: "Security",
  },
  {
    icon: <Users size={32} />,
    title: "Women's Community",
    description:
      "Safe, supportive community exclusively for working women and students.",
    color: "from-orange-500 to-yellow-500",
    stats: "100%",
    statLabel: "Women Only",
  },
  {
    icon: <Clock size={32} />,
    title: "Flexible Timings",
    description: "No strict curfews with secure access system for residents.",
    color: "from-yellow-500 to-orange-500",
    stats: "0",
    statLabel: "Curfews",
  },
  {
    icon: <Flower size={32} />,
    title: "Clean Environment",
    description: "Regular housekeeping and well-maintained common areas.",
    color: "from-orange-500 to-yellow-500",
    stats: "Daily",
    statLabel: "Cleaning",
  },
  {
    icon: <Heart size={32} />,
    title: "Homely Atmosphere",
    description: "Caring staff and amenities that make you feel at home.",
    color: "from-yellow-500 to-orange-500",
    stats: "100%",
    statLabel: "Homely",
  },
];

const About = () => {
  return (
    <section id="about" className="py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-yellow-50/50" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-orange-200/20 to-yellow-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-yellow-200/20 to-orange-200/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-3 rounded-full mb-8 shadow-xl"
          >
            <Star size={16} />
            <span className="font-semibold text-sm">
              About Sunrise PG Services
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-black mb-8"
          >
            Welcome to <span className="sunrise-text">Sunrise PG Services</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed"
          >
            Your premier accommodation choice in Hinjewadi Phase 1, Pune. Opened
            in April 2014, our brand new facility is designed specifically for
            female professionals and students.
          </motion.p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Story Cards */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-orange-200/50">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Star size={28} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Our Story
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Established April 2014
                      </p>
                    </div>
                  </div>
                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                    Welcome to{" "}
                    <span className="font-semibold text-orange-600 dark:text-orange-400">
                      Sunrise PG Services
                    </span>
                    , an exclusive girls&apos; paying guest accommodation that
                    opened in April 2014 in the heart of Hinjewadi, Pune. Our
                    building offers a perfect blend of comfort, security, and
                    modern amenities designed specifically for working women and
                    female students.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-yellow-200/50">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <MapPin size={28} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Prime Location
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Hinjewadi Phase 1
                      </p>
                    </div>
                  </div>
                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                    Strategically located near Hinjewadi IT Park and major
                    educational institutions, our PG provides convenient and
                    safe accommodation with easy access to workplaces, shopping
                    centers, and entertainment venues. We offer comfortable
                    2-sharing and 3-sharing rooms to suit your needs and budget.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-orange-200/50">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Heart size={28} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Community
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Supportive Environment
                      </p>
                    </div>
                  </div>
                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                    Experience a nurturing, homelike environment with our
                    dedicated staff, thoughtfully designed spaces, and a vibrant
                    community of like-minded women who prioritize their career
                    growth and personal well-being.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Content - Stats Grid */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-orange-200/50"
              >
                <div
                  className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-3xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <div className="text-white">{feature.icon}</div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {feature.title}
                  </h3>
                  <div className="text-right">
                    <div className="text-3xl font-black text-orange-600 dark:text-orange-400">
                      {feature.stats}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {feature.statLabel}
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
            <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-orange-200/50">
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                Ready to Start Your Journey?
              </h3>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Join our community of empowered women and experience the perfect
                blend of comfort, security, and modern living.
              </p>
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Link href="/register">
                  <span className="relative z-10 flex items-center gap-3">
                    Book Your Room Now
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </span>
                </Link>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
