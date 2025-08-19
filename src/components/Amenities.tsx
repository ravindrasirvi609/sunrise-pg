"use client";

import { motion } from "framer-motion";
import {
  Wifi,
  Utensils,
  ShowerHead,
  Bed,
  Tv,
  ParkingSquare,
  Shirt,
  Shield,
  Coffee,
  Clock,
  Book,
  Star,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const amenities = [
  {
    icon: <Wifi size={32} />,
    title: "High-Speed WiFi",
    description: "Uninterrupted internet access throughout the premises",
    color: "from-orange-500 to-yellow-500",
    features: [
      "100 Mbps Speed",
      "24/7 Connectivity",
      "Multiple Devices",
      "Secure Network",
    ],
    category: "Technology",
  },
  {
    icon: <Utensils size={32} />,
    title: "Nutritious Meals",
    description:
      "Healthy, homely meals three times a day with customization options",
    color: "from-yellow-500 to-orange-500",
    features: [
      "3 Meals Daily",
      "Vegetarian Options",
      "Customizable Menu",
      "Fresh Ingredients",
    ],
    category: "Dining",
  },
  {
    icon: <ShowerHead size={32} />,
    title: "Hot Water",
    description: "24/7 hot water supply with modern bathroom facilities",
    color: "from-orange-500 to-yellow-500",
    features: [
      "24/7 Availability",
      "Modern Bathrooms",
      "Clean Facilities",
      "Water Heaters",
    ],
    category: "Comfort",
  },
  {
    icon: <Bed size={32} />,
    title: "Comfortable Beds",
    description: "Premium quality mattresses and bedding for restful sleep",
    color: "from-yellow-500 to-orange-500",
    features: [
      "Premium Mattresses",
      "Fresh Bedding",
      "Extra Pillows",
      "Room Service",
    ],
    category: "Comfort",
  },
  {
    icon: <Shield size={32} />,
    title: "Enhanced Security",
    description: "Security guards, and CCTV surveillance",
    color: "from-orange-500 to-yellow-500",
    features: [
      "CCTV Cameras",
      "Security Guards",
      "Secure Entry",
      "Emergency Response",
    ],
    category: "Security",
  },
  {
    icon: <ParkingSquare size={32} />,
    title: "Secure Parking",
    description: "Well-lit, monitored parking space for vehicles",
    color: "from-yellow-500 to-orange-500",
    features: [
      "Covered Parking",
      "24/7 Monitoring",
      "Well-lit Area",
      "Security Guards",
    ],
    category: "Security",
  },
  {
    icon: <Shirt size={32} />,
    title: "Laundry Service",
    description: "Self-service laundry with washing and drying facilities.",
    color: "from-orange-500 to-yellow-500",
    features: [
      "Washing Machines",
      "Dryers Available",
      "Ironing Facilities",
      "Detergent Provided",
    ],
    category: "Convenience",
  },
  {
    icon: <Clock size={32} />,
    title: "Flexible Timings",
    description: "No strict curfew with late check-in and check-out facility",
    color: "from-yellow-500 to-orange-500",
    features: [
      "No Curfew",
      "24/7 Access",
      "Flexible Check-in",
      "Late Check-out",
    ],
    category: "Convenience",
  },
  {
    icon: <Tv size={32} />,
    title: "Entertainment",
    description: "Smart TV and recreational area for leisure time",
    color: "from-orange-500 to-yellow-500",
    features: ["Smart TV", "Recreation Room", "Board Games", "Movie Nights"],
    category: "Entertainment",
  },
  {
    icon: <Coffee size={32} />,
    title: "Lounge & Kitchen",
    description: "Fully equipped common kitchen and with self cooking facility",
    color: "from-yellow-500 to-orange-500",
    features: [
      "Fully Equipped",
      "Self Cooking",
      "Common Lounge",
      "Coffee Machine",
    ],
    category: "Dining",
  },
  {
    icon: <Book size={32} />,
    title: "Study Room",
    description: "Quiet study space with high-speed internet for work/study",
    color: "from-orange-500 to-yellow-500",
    features: [
      "Quiet Environment",
      "High-speed WiFi",
      "Study Tables",
      "24/7 Access",
    ],
    category: "Education",
  },
];

const categories = [
  "All",
  "Technology",
  "Dining",
  "Comfort",
  "Security",
  "Convenience",
  "Entertainment",
  "Education",
];

const Amenities = () => {
  return (
    <section id="amenities" className="py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 via-transparent to-orange-50/50" />
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-yellow-200/20 to-orange-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-tr from-orange-200/20 to-yellow-200/20 rounded-full blur-3xl" />

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
            <span className="font-semibold text-sm">Premium Amenities</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-black mb-8"
          >
            Modern <span className="sunrise-text">Amenities</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed"
          >
            Everything you need for a comfortable and convenient stay
          </motion.p>
        </div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                category === "All"
                  ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-xl"
                  : "bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 border border-orange-200/50"
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Amenities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {amenities.map((amenity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -8 }}
              className="group relative overflow-hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-orange-200/50"
            >
              {/* Category Badge */}
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-xs font-semibold rounded-full">
                  {amenity.category}
                </span>
              </div>

              {/* Icon */}
              <div
                className={`w-20 h-20 bg-gradient-to-br ${amenity.color} rounded-3xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <div className="text-white">{amenity.icon}</div>
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                {amenity.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                {amenity.description}
              </p>

              {/* Features List */}
              <div className="space-y-3 mb-6">
                {amenity.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-3">
                    <CheckCircle
                      size={16}
                      className="text-green-500 flex-shrink-0"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-20"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
            <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-orange-200/50">
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                Experience All Amenities
              </h3>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Book your stay today and enjoy all these premium amenities
                designed for your comfort and convenience.
              </p>
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
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Amenities;
