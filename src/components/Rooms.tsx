"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Users,
  Bed,
  Star,
  CheckCircle,
  ArrowRight,
  MapPin,
  Shield,
  Wifi,
  Coffee,
  Clock,
} from "lucide-react";

const rooms = [
  {
    type: "Triple Sharing",
    capacity: "3 Girls",
    price: "₹6,800/month",
    originalPrice: "₹8,000",
    discount: "20% OFF",
    features: [
      "Brand new room",
      "Spacious living area",
      "Personal cupboard",
      "Pillow and bed sheet provided with furnished room",
      "High-speed WiFi",
      "Attached bathroom",
    ],
    amenities: [
      { icon: <Wifi size={16} />, text: "High-speed WiFi" },
      { icon: <Shield size={16} />, text: "24/7 Security" },
      { icon: <Coffee size={16} />, text: "Meals Included" },
      { icon: <Clock size={16} />, text: "Flexible Timings" },
    ],
    gradient: "from-orange-500 to-yellow-500",
    icon: <Users size={32} />,
    popular: false,
    available: true,
    image: "/triple-room.jpg",
  },
  {
    type: "Twin Sharing",
    capacity: "2 Girls",
    price: "₹7,500/month",
    originalPrice: "₹9,000",
    discount: "21% OFF",
    features: [
      "Brand new room",
      "Premium twin beds",
      "Larger cupboards",
      "Pillow and bed sheet provided with furnished room",
      "High-speed WiFi",
      "Attached bathroom",
    ],
    amenities: [
      { icon: <Wifi size={16} />, text: "High-speed WiFi" },
      { icon: <Shield size={16} />, text: "24/7 Security" },
      { icon: <Coffee size={16} />, text: "Meals Included" },
      { icon: <Clock size={16} />, text: "Flexible Timings" },
    ],
    gradient: "from-yellow-500 to-orange-500",
    icon: <Bed size={32} />,
    popular: true,
    available: true,
    image: "/twin-room.jpg",
  },
];

const Rooms = () => {
  const router = useRouter();
  return (
    <section
      id="rooms"
      className="py-16 sm:py-20 md:py-24 lg:py-32 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-yellow-50/50" />
      <div className="absolute top-20 right-4 sm:right-20 w-48 sm:w-96 h-48 sm:h-96 bg-gradient-to-br from-orange-200/20 to-yellow-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-4 sm:left-20 w-40 sm:w-80 h-40 sm:h-80 bg-gradient-to-tr from-yellow-200/20 to-orange-200/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-6 sm:mb-8 shadow-xl"
          >
            <Star size={14} className="sm:w-4 sm:h-4" />
            <span className="font-semibold text-xs sm:text-sm">
              Room Options
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 sm:mb-8"
          >
            Choose Your <span className="sunrise-text">Room</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed px-4"
          >
            Our building opened in April 2014 with two comfortable room options
            designed for your comfort
          </motion.p>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 max-w-7xl mx-auto mb-12 sm:mb-16 md:mb-20">
          {rooms.map((room, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="relative group"
            >
              {/* Popular Badge */}
              {room.popular && (
                <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20">
                  <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-xl">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Discount Badge */}
              <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20">
                <div className="bg-green-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                  {room.discount}
                </div>
              </div>

              {/* Main Card */}
              <div className="relative">
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${room.gradient} rounded-2xl sm:rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
                />
                <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-orange-200/50">
                  {/* Header */}
                  <div
                    className={`bg-gradient-to-r ${room.gradient} p-4 sm:p-6 md:p-8 text-white relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div>
                          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold">
                            {room.type}
                          </h3>
                          <p className="text-white/90 mt-1 text-sm sm:text-base">
                            Perfect for {room.capacity}
                          </p>
                        </div>
                        <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center">
                          <div className="text-white scale-75 sm:scale-90 md:scale-100">
                            {room.icon}
                          </div>
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="flex items-center gap-2 sm:gap-4">
                        <div className="text-2xl sm:text-3xl md:text-4xl font-black">
                          {room.price}
                        </div>
                        <div className="text-white/70 line-through text-sm sm:text-lg">
                          {room.originalPrice}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-6 md:p-8">
                    {/* Amenities Icons */}
                    <div className="grid grid-cols-2 sm:flex sm:items-center sm:gap-4 mb-4 sm:mb-6">
                      {room.amenities.map((amenity, amenityIndex) => (
                        <div
                          key={amenityIndex}
                          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2 sm:mb-0"
                        >
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
                            <div className="text-white scale-75 sm:scale-90">
                              {amenity.icon}
                            </div>
                          </div>
                          <span className="text-xs sm:text-sm font-medium">
                            {amenity.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Features List */}
                    <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                      {room.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-start gap-2 sm:gap-3"
                        >
                          <CheckCircle
                            size={16}
                            className="text-green-500 flex-shrink-0 mt-0.5"
                          />
                          <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Availability Status */}
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${room.available ? "bg-green-500" : "bg-red-500"}`}
                        />
                        <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                          {room.available ? "Available" : "Fully Booked"}
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Limited rooms available
                      </div>
                    </div>

                    {/* CTA Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={!room.available}
                      onClick={() => room.available && router.push("/register")}
                      className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300 ${
                        room.available
                          ? "bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white shadow-xl hover:shadow-2xl"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {room.available ? (
                        <>
                          Book Now
                          <ArrowRight size={18} className="sm:w-5 sm:h-5" />
                        </>
                      ) : (
                        "Fully Booked"
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto"
        >
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
              <Shield size={20} className="sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2">
              All Inclusive
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 px-2">
              Meals, electricity, water, WiFi, and housekeeping services
              included
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
              <MapPin size={20} className="sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2">
              Prime Location
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 px-2">
              Walking distance to Hinjewadi IT Park and major educational
              institutions
            </p>
          </div>

          <div className="text-center sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
              <Clock size={20} className="sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2">
              Flexible Timings
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 px-2">
              No strict curfews with secure access system for residents
            </p>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-12 sm:mt-16 md:mt-20"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl sm:rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
            <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl border border-orange-200/50">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6">
                Limited Rooms Available!
              </h3>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
                Our building opened in April 2014 and rooms are filling up fast.
                Book your stay today to secure your spot!
              </p>
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                onClick={() => router.push("/register")}
              >
                <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                  Book Your Room Now
                  <ArrowRight
                    size={18}
                    className="sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform"
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

export default Rooms;
