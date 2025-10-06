"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function LampDemo() {
  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
      >
        Build lamps <br /> the right way
      </motion.h1>
    </LampContainer>
  );
}

export const LampContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "lamp-container relative flex flex-col items-center w-full",
        className
      )}
      style={{
        position: 'relative',
        minHeight: 'auto',
        zIndex: 10,
        isolation: 'isolate',
        padding: '0.75rem 0 0',
        overflow: 'hidden'
      }}
    >
      {/* Background Layer */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        background: 'radial-gradient(circle at center, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 1) 100%)',
        backdropFilter: 'blur(4px)'
      }} />
      
      {/* Lamp Effect */}
      <div className="relative w-full flex-1 flex items-center justify-center px-4 sm:px-6" style={{ height: '12px' }}>
        <div className="w-full max-w-4xl mx-auto">
          {/* Main Tube Light Glow */}
          <motion.div
            initial={{ opacity: 0.3, width: "30%" }}
            whileInView={{ opacity: 1, width: "100%" }}
            transition={{
              delay: 0.1,
              duration: 0.8,
              ease: "easeOut",
            }}
            className="absolute left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-400/40 via-emerald-400/40 to-cyan-400/40 blur-xl"
            style={{
              borderRadius: '1px',
              height: '8px',
              maxWidth: 'calc(100% - 2rem)',
            }}
          />

          {/* Tube Light Core */}
          <motion.div
            initial={{ opacity: 0.4, width: "40%" }}
            whileInView={{ opacity: 1, width: "100%" }}
            transition={{
              delay: 0.2,
              duration: 0.8,
              ease: "easeOut",
            }}
            className="absolute left-1/2 -translate-x-1/2 z-30 bg-gradient-to-r from-cyan-200 via-emerald-200 to-cyan-200"
            style={{
              borderRadius: '1px',
              height: '4px',
              maxWidth: 'calc(100% - 2rem)',
              boxShadow: '0 0 12px 4px rgba(34, 211, 238, 0.5)',
            }}
          />

          {/* Light Beams */}
          <motion.div
            initial={{ opacity: 0.2, width: "30%" }}
            whileInView={{ opacity: 0.9, width: "90%" }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeOut",
            }}
            className="absolute left-1/2 -translate-x-1/2 z-20 bg-gradient-to-r from-cyan-200/50 via-transparent to-emerald-200/50"
            style={{
              borderRadius: '1px',
              height: '6px',
              maxWidth: 'calc(100% - 3rem)',
              filter: 'blur(6px)'
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 w-full px-4 sm:px-6 lg:px-8 mt-2">
        <div className="w-full max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default LampContainer;
