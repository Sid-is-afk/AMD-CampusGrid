'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Aarav Patel',
    role: 'Campus Manager',
    college: 'Delhi University',
    message:
      'CampusGrid transformed how we manage resources. We saved over 40% on resource wastage in just 3 months.',
    rating: 5,
  },
  {
    name: 'Sarah Chen',
    role: 'IT Director',
    college: 'Stanford University',
    message:
      'The real-time bidding system is brilliant. Our faculty loves the transparency and efficiency it brings.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Student Event Coordinator',
    college: 'IIT Mumbai',
    message:
      'Planning events became so much easier. We can instantly see available resources and book them without delays.',
    rating: 5,
  },
];

export function TestimonialsSection() {
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
            Loved by Campus Leaders
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            See what administrators, faculty, and students say about CampusGrid.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group p-8 rounded-xl border border-border bg-card/50 glass hover:border-accent/30 transition-all"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array(testimonial.rating)
                  .fill(0)
                  .map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.1 + i * 0.05,
                      }}
                    >
                      <Star
                        className="w-4 h-4 fill-accent text-accent"
                        key={i}
                      />
                    </motion.div>
                  ))}
              </div>

              {/* Quote */}
              <p className="text-lg text-foreground mb-6 leading-relaxed">
                "{testimonial.message}"
              </p>

              {/* Author */}
              <div className="border-t border-border/30 pt-6">
                <p className="font-semibold text-foreground">
                  {testimonial.name}
                </p>
                <p className="text-sm text-primary">{testimonial.role}</p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.college}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
