
import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { translations } from '../constants';

const HomePage: React.FC = () => {
  const { setPage } = useAppContext();

  return (
    <div className="text-center py-10 md:py-20">
      <h1 className="text-4xl md:text-5xl font-bold text-[#FF9933]">
        {translations.en.welcomeMessage}
      </h1>
      <h2 className="text-3xl md:text-4xl font-bold text-[#138808] mt-2">
        {translations.mr.welcomeMessage}
      </h2>
      <p className="text-lg text-gray-700 mt-6 max-w-2xl mx-auto">
        {translations.en.tagline}
        <br />
        {translations.mr.tagline}
      </p>
      <button
        onClick={() => setPage('marketplace')}
        className="mt-10 px-8 py-3 bg-[#138808] text-white text-lg font-semibold rounded-lg shadow-md hover:bg-green-700 transition-transform transform hover:scale-105 duration-300"
      >
        {translations.en.exploreVendors} / {translations.mr.exploreVendors}
      </button>
    </div>
  );
};

export default HomePage;
