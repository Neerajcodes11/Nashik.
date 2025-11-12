import React, { useState, useMemo, useCallback } from 'react';
import type { User, Language, Page, AppContextType } from './types';
import { AppContext } from './contexts/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MarketplacePage from './pages/MarketplacePage';
import VendorProfilePage from './pages/VendorProfilePage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import { fetchUsers } from './services/api';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [selectedVendorId, setSelectedVendorId] = useState<number | null>(null);

  const login = useCallback(async (email: string, userType: 'customer' | 'vendor' | 'admin') => {
    try {
      const users = await fetchUsers();
      const foundUser = users.find(u => u.email === email && u.type === userType);
      if (foundUser) {
        setUser(foundUser);
        if (foundUser.type === 'admin') {
          setPage('admin');
        } else {
          setPage('dashboard');
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setPage('home');
  }, []);

  const viewVendor = (id: number) => {
    setSelectedVendorId(id);
    setPage('vendorProfile');
  };

  const contextValue = useMemo<AppContextType>(() => ({
    user,
    login,
    logout,
    language,
    setLanguage,
    page,
    setPage,
    viewVendor,
  }), [user, login, logout, language, setLanguage, page, setPage]);

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <HomePage />;
      case 'login':
        return <LoginPage />;
      case 'signup':
        return <SignupPage />;
      case 'marketplace':
        return <MarketplacePage />;
      case 'vendorProfile':
        return selectedVendorId ? <VendorProfilePage vendorId={selectedVendorId} /> : <MarketplacePage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'admin':
        return user?.type === 'admin' ? <AdminPage /> : <HomePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen flex flex-col bg-[#F9F9F2] text-gray-800">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          {renderPage()}
        </main>
        <Footer />
        <Chatbot />
      </div>
    </AppContext.Provider>
  );
};

export default App;
