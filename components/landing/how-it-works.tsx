'use client';

import { motion } from 'framer-motion';
import { Check, LogIn, Zap, BarChart3 } from 'lucide-react';

const steps = [
  {
    icon: LogIn,
    title: 'Sign Up',
    description: 'Create your institution account and invite your team members to get started.',
    details: 'Setup takes less than 5 minutes',
  },
  {
    icon: Zap,
    title: 'Start Bidding',
    description: 'Browse available resources and place bids based on your campus needs.',
    details: 'Real-time pricing and availability',
  },
  {
    icon: BarChart3,
    title: 'Track & Optimize',
    description: 'Monitor your resource usage and get insights to optimize allocation.',
    details: 'Comprehensive analytics dashboard',
  },
  {
    icon: Check,
    title: 'Scale Up',
    description: 'Expand across multiple campuses with unified management.',
    details: 'Enterprise-grade support included',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 sm:py-32 bg-card/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-balance">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple steps to transform your campus resource management.
          </p>
        </motion.div>

        <div className="relative">
          {/* Desktop timeline line */}
          <div className="hidden lg:block absolute top-1/4 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-20" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  {/* Number badge */}
                  <motion.div
                    className="mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent text-white font-bold text-xl relative z-10"
                    whileHover={{ scale: 1.1 }}
                  >
                    {index + 1}
                  </motion.div>

                  {/* Content */}
                  <div className="pt-2">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="w-5 h-5 text-primary" />
                      <h3 className="text-xl font-semibold text-foreground">
                        {step.title}
                      </h3>
                    </div>

                    <p className="text-muted-foreground mb-3">
                      {step.description}
                    </p>

                    <p className="text-sm text-primary/70 font-medium">
                      {step.details}
                    </p>
                  </div>

                  {/* Mobile connector */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden my-4 mx-8 h-12 border-l-2 border-primary/30 relative">
                      <motion.div
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-primary"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                      >
                        ↓
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
