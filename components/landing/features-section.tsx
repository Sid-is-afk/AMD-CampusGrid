'use client';

import { motion } from 'framer-motion';
import {
  Users,
  TrendingUp,
  Globe,
  Sparkles,
  Map,
  Shield,
} from 'lucide-react';
import Image from 'next/image';

const features = [
  {
    icon: Sparkles,
    title: 'Smart AI Agent',
    description: 'Conversational booking assistant that respects your budget and timeline constraints.',
  },
  {
    icon: Map,
    title: 'Intelligent Day Planner',
    description: 'Automatically optimize your campus route and study locations to save you time and tokens.',
  },
  {
    icon: Users,
    title: 'Transparent Recommender',
    description: 'Get clear, explainable suggestions for resources based on live utilization and your preferences.',
  },
  {
    icon: TrendingUp,
    title: 'Dynamic Balancing',
    description: 'Real-time adjustments redirect traffic from high-load areas to quieter zones.',
  },
  {
    icon: Shield,
    title: 'Admin Command Center',
    description: 'Panoramic view of global campus metrics with manual AI weight override controls.',
  },
  {
    icon: Globe,
    title: 'Global Scale',
    description: 'Multi-campus support with a unified dashboard across institutions.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 sm:py-32 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-balance">
            Powerful Features for Modern Campuses
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage campus resources efficiently and effectively.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  className="group p-6 rounded-xl border border-border bg-card/50 glass hover:border-primary/30 transition-all"
                >
                  <div className="mb-4 inline-flex p-2.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Features Dashboard Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative h-[500px] w-full lg:h-[700px] rounded-2xl overflow-hidden glass border border-primary/20"
          >
            <Image
              src="/features-dashboard.jpg"
              alt="CampusGrid Dashboard Preview"
              fill
              className="object-cover object-left-top"
            />
            {/* Soft overlay to blend edges */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-transparent lg:hidden" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
