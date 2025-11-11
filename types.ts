import type React from 'react';

export type Language = 'en' | 'mr';
export type Page = 'home' | 'login' | 'signup' | 'marketplace' | 'vendorProfile' | 'dashboard' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: 'customer' | 'vendor' | 'admin';
}

export interface Vendor {
  id: number;
  userId: number;
  shopName: string;
  ownerName: string;
  category: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  workingHours: string;
  description: string;
  paymentMethods: string[];
  status: 'pending' | 'approved' | 'rejected';
}

export interface AppContextType {
  user: User | null;
  login: (email: string, userType: 'customer' | 'vendor' | 'admin') => boolean;
  logout: () => void;
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  page: Page;
  setPage: React.Dispatch<React.SetStateAction<Page>>;
  viewVendor: (id: number) => void;
}

// FIX: Define and export GroundingChunk and ChatMessage types for the Gemini chatbot.
export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  grounding?: GroundingChunk[];
}
