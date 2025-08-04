"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  MapPin,
  Heart,
  Shield,
  Sparkles,
  Sun,
  Star,
  Zap,
  Play,
  CheckCircle,
} from "lucide-react";

const Hero = () => {
  const featureAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5 + i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-orange-900/20 dark:via-yellow-900/10 dark:to-orange-900/30" />

        {/* Floating geometric shapes */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-20 right-20 w-40 h-40 border-2 border-orange-300/30 rounded-full"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-20 left-20 w-60 h-60 border-2 border-yellow-300/30 rounded-full"
        />

        {/* Animated sun rays */}
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 left-1/4 w-32 h-32"
        >
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-8 bg-gradient-to-b from-orange-400 to-transparent"
              style={{
                transform: `rotate(${i * 45}deg) translateY(-20px)`,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 z-10 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-screen py-20">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-3 rounded-full shadow-xl"
            >
              <Sparkles size={16} />
              <span className="font-semibold text-sm">Brand New Facility</span>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-6xl md:text-7xl lg:text-8xl font-black leading-tight"
            >
              <span className="text-gray-800 dark:text-white">Welcome to</span>
              <br />
              <span className="sunrise-text">Sunrise</span>
              <br />
              <span className="text-gray-800 dark:text-white">PG</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 font-medium leading-relaxed"
            >
              Where every morning brings new opportunities and every evening
              brings comfort
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg text-gray-700 dark:text-gray-400 leading-relaxed max-w-2xl"
            >
              Experience premium accommodation designed exclusively for women.
              Our brand new facility offers modern amenities, enhanced security,
              and a supportive community in the heart of Hinjewadi.
            </motion.p>

            {/* Location Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex items-center gap-4 p-6 bg-white/90 dark:bg-gray-800/90 rounded-2xl backdrop-blur-sm shadow-xl border border-orange-200/50"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                <MapPin size={24} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-800 dark:text-white text-lg">
                  Prime Location
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Hinjewadi Phase 1, Pune • Near IT Park
                </p>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Book Your Stay
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group relative overflow-hidden border-2 border-orange-500 text-orange-600 dark:text-orange-400 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-500 hover:text-white transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Play
                    size={20}
                    className="group-hover:scale-110 transition-transform"
                  />
                  Watch Video
                </span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Content - Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
          >
            {/* Main Feature Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative mb-8"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-3xl blur-xl opacity-20" />
              <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-orange-200/50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Shield size={28} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                      24/7 Security
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      CCTV surveillance and dedicated security staff
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    "CCTV cameras in all common areas",
                    "Dedicated security personnel",
                    "Secure entry system",
                    "Emergency response protocols",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle
                        size={16}
                        className="text-green-500 flex-shrink-0"
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: <Heart size={28} />,
                  title: "Women Only",
                  description: "Safe and supportive community environment",
                  gradient: "from-yellow-500 to-orange-500",
                },
                {
                  icon: <Zap size={28} />,
                  title: "High-Speed WiFi",
                  description: "Fast internet for work and entertainment",
                  gradient: "from-orange-500 to-yellow-500",
                },
                {
                  icon: <Star size={28} />,
                  title: "Premium Amenities",
                  description: "Modern facilities and comfortable living",
                  gradient: "from-yellow-500 to-orange-500",
                },
                {
                  icon: <MapPin size={28} />,
                  title: "Prime Location",
                  description: "Walking distance to Hinjewadi IT Park",
                  gradient: "from-orange-500 to-yellow-500",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={featureAnimation}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group relative overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-orange-200/50"
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-12 border-2 border-orange-400 rounded-full flex items-center justify-center">
          <motion.div
            animate={{
              y: [0, 8, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="w-2 h-3 bg-gradient-to-b from-orange-500 to-yellow-500 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
