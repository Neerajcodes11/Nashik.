
import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { translations } from '../constants';

const Header: React.FC = () => {
  const { language, setLanguage, user, logout, setPage } = useAppContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const t = translations[language];

  const NavLink: React.FC<{ pageName: string; children: React.ReactNode }> = ({ pageName, children }) => (
    <button onClick={() => { setPage(pageName as any); setMenuOpen(false); }} className="block w-full text-left md:w-auto md:inline-block mt-4 md:mt-0 md:ml-6 py-2 md:py-0 text-gray-700 hover:text-[#FF9933] transition-colors duration-300">
      {children}
    </button>
  );

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <svg className="w-8 h-8 text-[#138808]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          <button onClick={() => setPage('home')} className="ml-2 text-xl font-bold text-[#FF9933]">
            {t.appName}
          </button>
        </div>
        
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
        </div>

        <nav className={`absolute md:relative top-full left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none p-4 md:p-0 md:flex items-center ${menuOpen ? 'block' : 'hidden'}`}>
          <NavLink pageName="home">{t.home}</NavLink>
          <NavLink pageName="marketplace">{t.marketplace}</NavLink>
          {user && <NavLink pageName="dashboard">{t.dashboard}</NavLink>}
          {user && user.type === 'admin' && <NavLink pageName="admin">{t.adminPanel}</NavLink>}
          
          <div className="relative mt-4 md:mt-0 md:ml-6">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'mr')}
              className="appearance-none w-full md:w-auto bg-gray-100 border border-gray-300 rounded-md py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-[#FF9933] transition-colors"
            >
              <option value="en">{t.english}</option>
              <option value="mr">{t.marathi}</option>
            </select>
          </div>

          {!user ? (
            <>
              <button onClick={() => { setPage('login'); setMenuOpen(false); }} className="block w-full text-left md:w-auto mt-4 md:mt-0 md:ml-6 bg-transparent text-[#138808] font-semibold py-2 px-4 border border-[#138808] rounded hover:bg-[#138808] hover:text-white transition-all duration-300">
                {t.login}
              </button>
              <button onClick={() => { setPage('signup'); setMenuOpen(false); }} className="block w-full text-left md:w-auto mt-2 md:mt-0 md:ml-2 bg-[#FF9933] text-white font-semibold py-2 px-4 rounded hover:bg-orange-500 transition-all duration-300">
                {t.signup}
              </button>
            </>
          ) : (
            <button onClick={() => { logout(); setMenuOpen(false); }} className="block w-full text-left md:w-auto mt-4 md:mt-0 md:ml-6 bg-transparent text-red-600 font-semibold py-2 px-4 border border-red-500 rounded hover:bg-red-500 hover:text-white transition-all duration-300">
              {t.logout}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
