"use client"

import { motion } from "framer-motion"

export function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: "easeOut", delay: 0.7 }}
      className="fixed inset-0 z-[999] flex items-center justify-center"
      style={{
        background: "linear-gradient(180deg, rgba(20,20,20,1) 0%, rgba(10,10,10,1) 100%)",
        backdropFilter: "blur(6px)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative flex flex-col items-center"
      >
        {/* Glow */}
        <div
          className="absolute -bottom-2 w-24 h-6 rounded-full blur-xl opacity-40"
          style={{
            background: "rgba(255, 228, 180, 0.4)",
          }}
        />

        {/* Logo */}
        <img
          src="/images/vidi-logo-beige.png"
          alt="VIDI"
          className="h-14 relative z-10"
        />
      </motion.div>
    </motion.div>
  )
}
