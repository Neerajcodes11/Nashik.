
import React from 'react';
import type { Vendor } from '../types';
import { useAppContext } from '../hooks/useAppContext';
import { translations } from '../constants';

interface VendorCardProps {
  vendor: Vendor;
}

const VendorCard: React.FC<VendorCardProps> = ({ vendor }) => {
  const { language, viewVendor } = useAppContext();
  const t = translations[language];

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
      <div>
        <h3 className="text-xl font-bold text-[#138808]">{vendor.shopName}</h3>
        <p className="text-gray-600 mt-1">{t.category}: {vendor.category}</p>
        <p className="text-gray-500 mt-2 flex items-center">
          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          {vendor.address}
        </p>
      </div>
      <button 
        onClick={() => viewVendor(vendor.id)}
        className="mt-4 w-full bg-[#FF9933] text-white font-semibold py-2 px-4 rounded hover:bg-orange-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
      >
        {translations[language].shopDetails}
      </button>
    </div>
  );
};

export default VendorCard;
