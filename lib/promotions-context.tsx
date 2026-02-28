'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Promotion {
  id: string;
  title: string;
  description: string;
  category: 'fest' | 'competition' | 'workshop' | 'seminar';
  date: string;
  location: string;
  organizer: string;
  imageUrl: string;
  isFeatured: boolean;
  externalLink?: string;
  createdAt: Date;
  attendees: number;
  badge: 'Featured' | 'Hot' | 'Trending' | 'New';
}

interface PromotionsContextType {
  promotions: Promotion[];
  addPromotion: (promo: Omit<Promotion, 'id' | 'createdAt'>) => void;
  updatePromotion: (id: string, promo: Partial<Promotion>) => void;
  deletePromotion: (id: string) => void;
  toggleFeatured: (id: string) => void;
}

const PromotionsContext = createContext<PromotionsContextType | undefined>(undefined);

const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: '1',
    title: 'Annual Tech Fest 2025',
    category: 'fest',
    date: 'March 15-17, 2025',
    location: 'Main Campus',
    organizer: 'Tech Club',
    description: 'The biggest tech festival of the year with workshops, competitions, and networking opportunities.',
    attendees: 5000,
    badge: 'Featured',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178aa50ab29e?w=500&h=300&fit=crop',
    isFeatured: true,
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Coding Competition',
    category: 'competition',
    date: 'April 5, 2025',
    location: 'Computer Lab Building',
    organizer: 'CS Department',
    description: 'Campus-wide coding competition with prizes worth 50,000 rupees.',
    attendees: 200,
    badge: 'Hot',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
    isFeatured: true,
    createdAt: new Date(),
  },
  {
    id: '3',
    title: 'Annual Sports Day',
    category: 'fest',
    date: 'February 28 - March 2, 2025',
    location: 'Sports Complex',
    organizer: 'Sports Committee',
    description: 'Campus sports championships featuring cricket, badminton, and more.',
    attendees: 3000,
    badge: 'Trending',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=300&fit=crop',
    isFeatured: true,
    createdAt: new Date(),
  },
  {
    id: '4',
    title: 'AI & Machine Learning Workshop',
    category: 'workshop',
    date: 'March 10, 2025',
    location: 'Innovation Hub',
    organizer: 'AI Club',
    description: 'Hands-on workshop on latest AI technologies and industry applications.',
    attendees: 150,
    badge: 'New',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06a261d41c5?w=500&h=300&fit=crop',
    isFeatured: false,
    createdAt: new Date(),
  },
];

export function PromotionsProvider({ children }: { children: React.ReactNode }) {
  const [promotions, setPromotions] = useState<Promotion[]>(INITIAL_PROMOTIONS);

  const addPromotion = useCallback(
    (promo: Omit<Promotion, 'id' | 'createdAt'>) => {
      const newPromo: Promotion = {
        ...promo,
        id: `promo-${Date.now()}`,
        createdAt: new Date(),
      };
      setPromotions((prev) => [newPromo, ...prev]);
    },
    []
  );

  const updatePromotion = useCallback(
    (id: string, updates: Partial<Promotion>) => {
      setPromotions((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );
    },
    []
  );

  const deletePromotion = useCallback((id: string) => {
    setPromotions((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const toggleFeatured = useCallback((id: string) => {
    setPromotions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFeatured: !p.isFeatured } : p))
    );
  }, []);

  return (
    <PromotionsContext.Provider
      value={{ promotions, addPromotion, updatePromotion, deletePromotion, toggleFeatured }}
    >
      {children}
    </PromotionsContext.Provider>
  );
}

export function usePromotions() {
  const context = useContext(PromotionsContext);
  if (!context) {
    throw new Error('usePromotions must be used within PromotionsProvider');
  }
  return context;
}
