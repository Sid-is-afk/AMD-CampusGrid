'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const promotions = [
  {
    id: 1,
    title: 'Annual Tech Fest 2025',
    category: 'fest',
    date: 'March 15-17, 2025',
    location: 'Main Campus',
    organizer: 'Tech Club',
    description:
      'The biggest tech festival of the year with workshops, competitions, and networking opportunities.',
    attendees: 5000,
    badge: 'Featured',
    image: '/events-fest.jpg',
  },
  {
    id: 2,
    title: 'Coding Competition',
    category: 'competition',
    date: 'April 5, 2025',
    location: 'Computer Lab Building',
    organizer: 'CS Department',
    description: 'Campus-wide coding competition with prizes worth 50,000 rupees.',
    attendees: 200,
    badge: 'Hot',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
  },
  {
    id: 3,
    title: 'Annual Sports Day',
    category: 'fest',
    date: 'February 28 - March 2, 2025',
    location: 'Sports Complex',
    organizer: 'Sports Committee',
    description: 'Campus sports championships featuring cricket, badminton, and more.',
    attendees: 3000,
    badge: 'Trending',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=300&fit=crop',
  },
  {
    id: 4,
    title: 'AI & Machine Learning Workshop',
    category: 'workshop',
    date: 'March 10, 2025',
    location: 'Innovation Hub',
    organizer: 'AI Club',
    description:
      'Hands-on workshop on latest AI technologies and industry applications.',
    attendees: 150,
    badge: 'New',
    image: '/features-dashboard.jpg',
  },
];

const categoryColors = {
  fest: 'from-blue-500 to-purple-500',
  competition: 'from-red-500 to-orange-500',
  workshop: 'from-green-500 to-teal-500',
  seminar: 'from-yellow-500 to-orange-500',
};

const badgeColors = {
  Featured: 'bg-primary/20 text-primary',
  Hot: 'bg-red-500/20 text-red-400',
  Trending: 'bg-accent/20 text-accent',
  New: 'bg-green-500/20 text-green-400',
};

export function PromotionsSection() {
  const [selectedPromo, setSelectedPromo] = useState<(typeof promotions)[0] | null>(null);

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
            Campus Events & Promotions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover and promote upcoming college events, fests, competitions, and workshops.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {promotions.map((promo, index) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              onClick={() => setSelectedPromo(promo)}
              className="group cursor-pointer"
            >
              <div className="rounded-xl border border-border bg-card/50 glass overflow-hidden hover:border-primary/30 transition-all h-full flex flex-col">
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                  <motion.img
                    src={promo.image}
                    alt={promo.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* Category Badge */}
                  <div
                    className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${categoryColors[promo.category as keyof typeof categoryColors]
                      } shadow-lg`}
                  >
                    {promo.category.charAt(0).toUpperCase() +
                      promo.category.slice(1)}
                  </div>

                  {/* Trend Badge */}
                  <div
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${badgeColors[promo.badge as keyof typeof badgeColors]
                      }`}
                  >
                    {promo.badge}
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col">
                  <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
                    {promo.title}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {promo.description}
                  </p>

                  <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>{promo.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{promo.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span>{promo.attendees} expected attendees</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-border/30 flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">
                      by {promo.organizer}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-lg text-muted-foreground mb-4">
            Want to promote your event or fest?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toast.success("Event submission portal coming soon! Contact support to list your event.")}
            className="px-8 py-3 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-lg transition-colors"
          >
            Submit Event/Promotion
          </motion.button>
        </motion.div>
      </div>

      {/* Event Detail Modal */}
      {selectedPromo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedPromo(null)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-2xl max-w-2xl w-full overflow-hidden glass"
          >
            <div className="relative h-64">
              <img
                src={selectedPromo.image}
                alt={selectedPromo.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedPromo(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-8">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-3xl font-bold text-foreground">
                  {selectedPromo.title}
                </h2>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${badgeColors[selectedPromo.badge as keyof typeof badgeColors]
                    }`}
                >
                  {selectedPromo.badge}
                </span>
              </div>

              <p className="text-lg text-muted-foreground mb-6">
                {selectedPromo.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="font-semibold">{selectedPromo.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-semibold">{selectedPromo.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Attendees</p>
                    <p className="font-semibold">{selectedPromo.attendees}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Organizer</p>
                  <p className="font-semibold">{selectedPromo.organizer}</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors"
              >
                Register & Learn More
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
