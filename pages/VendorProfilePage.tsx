import React, { useState, useEffect } from 'react';
import type { Vendor } from '../types';
import { fetchVendorById, mockUsers } from '../services/api';
import { useAppContext } from '../hooks/useAppContext';
import { translations } from '../constants';

interface VendorProfilePageProps {
  vendorId: number;
}

const VendorProfilePage: React.FC<VendorProfilePageProps> = ({ vendorId }) => {
  const { language, setPage } = useAppContext();
  const t = translations[language];
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVendor = async () => {
      setLoading(true);
      const fetchedVendor = await fetchVendorById(vendorId);
      if (fetchedVendor) {
        setVendor(fetchedVendor);
      }
      setLoading(false);
    };
    loadVendor();
  }, [vendorId]);

  if (loading) {
    return <div className="text-center py-10">Loading vendor details...</div>;
  }

  if (!vendor) {
    return <div className="text-center py-10">Vendor not found.</div>;
  }

  const DetailItem: React.FC<{ label: string; value: string | React.ReactNode }> = ({ label, value }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value}</dd>
    </div>
  );

  return (
    <div className="bg-white shadow-xl rounded-lg overflow-hidden max-w-4xl mx-auto">
      <div className="p-6 sm:p-8">
        <button onClick={() => setPage('marketplace')} className="mb-6 text-sm text-[#FF9933] hover:underline flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            {t.backToMarketplace}
        </button>
        <h1 className="text-3xl font-bold text-[#138808]">{vendor.shopName}</h1>
        <p className="text-md text-gray-600 mt-1">{vendor.category}</p>
        
        <div className="mt-6 border-t border-gray-200">
          <dl>
            <DetailItem label={t.ownerName} value={vendor.ownerName} />
            <DetailItem label={t.contactInfo} value={mockUsers.find(u => u.id === vendor.userId)?.phone || 'N/A'} />
            <DetailItem label={t.address} value={vendor.address} />
            <DetailItem label={t.workingHours} value={vendor.workingHours} />
            <DetailItem label={t.paymentMethods} value={vendor.paymentMethods.join(', ')} />
            <DetailItem label={t.aboutShop} value={<p className="whitespace-pre-wrap">{vendor.description}</p>} />
          </dl>
        </div>
      </div>
      <div className="px-6 sm:px-8 pb-8">
         <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.viewOnMap}</h2>
         <div className="w-full h-64 md:h-80 rounded-lg bg-gray-200 flex flex-col items-center justify-center text-center p-4">
            <svg className="w-12 h-12 text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35" />
            </svg>
            <p className="font-semibold text-gray-700">Map preview unavailable</p>
            <p className="text-sm text-gray-500 mt-1">A valid Google Maps API key is required for this feature.</p>
            <p className="font-bold text-gray-800 mt-4">{vendor.address}</p>
        </div>
         <a 
            href={`https://www.google.com/maps/dir/?api=1&destination=${vendor.location.lat},${vendor.location.lng}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-4 inline-block w-full text-center bg-[#FF9933] text-white font-semibold py-2 px-4 rounded hover:bg-orange-500 transition-all duration-300"
         >
            {t.getDirections}
         </a>
      </div>
    </div>
  );
};

export default VendorProfilePage;