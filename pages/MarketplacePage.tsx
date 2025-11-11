
import React, { useState, useEffect, useMemo } from 'react';
import type { Vendor } from '../types';
import { fetchVendors } from '../services/api';
import { useAppContext } from '../hooks/useAppContext';
import { translations, VENDOR_CATEGORIES, NASHIK_AREAS } from '../constants';
import VendorCard from '../components/VendorCard';

const MarketplacePage: React.FC = () => {
  const { language } = useAppContext();
  const t = translations[language];
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [areaFilter, setAreaFilter] = useState('');

  useEffect(() => {
    const loadVendors = async () => {
      setLoading(true);
      const allVendors = await fetchVendors();
      setVendors(allVendors.filter(v => v.status === 'approved'));
      setLoading(false);
    };
    loadVendors();
  }, []);

  const filteredVendors = useMemo(() => {
    return vendors.filter(vendor => {
      const categoryMatch = categoryFilter ? vendor.category.toLowerCase() === categoryFilter.toLowerCase() : true;
      const areaMatch = areaFilter ? vendor.address.toLowerCase().includes(areaFilter.toLowerCase()) : true;
      return categoryMatch && areaMatch;
    });
  }, [vendors, categoryFilter, areaFilter]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8 text-[#138808]">{t.findVendors}</h1>
      <div className="mb-8 p-4 bg-white rounded-lg shadow-md flex flex-col md:flex-row gap-4">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full md:w-1/2 p-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF9933]"
        >
          <option value="">{t.allCategories}</option>
          {VENDOR_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <select
          value={areaFilter}
          onChange={(e) => setAreaFilter(e.target.value)}
          className="w-full md:w-1/2 p-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF9933]"
        >
          <option value="">{t.allAreas}</option>
          {NASHIK_AREAS.map(area => <option key={area} value={area}>{area}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="text-center">Loading vendors...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.length > 0 ? (
            filteredVendors.map(vendor => <VendorCard key={vendor.id} vendor={vendor} />)
          ) : (
            <p className="col-span-full text-center text-gray-600">No vendors found matching your criteria.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;
