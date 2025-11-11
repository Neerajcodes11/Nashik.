
import React, { useState, useEffect } from 'react';
import type { Vendor } from '../types';
import { fetchVendors } from '../services/api';
import { useAppContext } from '../hooks/useAppContext';
import { translations } from '../constants';

const AdminPage: React.FC = () => {
  const { language } = useAppContext();
  const t = translations[language];
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVendors = async () => {
      setLoading(true);
      const allVendors = await fetchVendors();
      setVendors(allVendors);
      setLoading(false);
    };
    loadVendors();
  }, []);
  
  const handleApproval = (vendorId: number, newStatus: 'approved' | 'rejected') => {
      setVendors(vendors.map(v => v.id === vendorId ? {...v, status: newStatus} : v));
  };
  
  const StatusBadge: React.FC<{ status: Vendor['status'] }> = ({ status }) => {
      const statusMap = {
          pending: { text: t.pending, color: 'bg-yellow-100 text-yellow-800' },
          approved: { text: t.approved, color: 'bg-green-100 text-green-800' },
          rejected: { text: t.rejected, color: 'bg-red-100 text-red-800' }
      };
      return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusMap[status].color}`}>{statusMap[status].text}</span>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center text-[#138808]">{t.adminPanel}</h1>
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">{t.vendorApproval}</h2>
      
      {loading ? (
        <p>Loading vendors...</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{t.shopName}</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{t.ownerName}</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{t.status}</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map(vendor => (
                  <tr key={vendor.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{vendor.shopName}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{vendor.ownerName}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <StatusBadge status={vendor.status} />
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {vendor.status === 'pending' && (
                        <div className="flex gap-2">
                           <button onClick={() => handleApproval(vendor.id, 'approved')} className="text-xs bg-green-500 text-white font-semibold py-1 px-3 rounded hover:bg-green-600 transition-all duration-300">{t.approve}</button>
                           <button onClick={() => handleApproval(vendor.id, 'rejected')} className="text-xs bg-red-500 text-white font-semibold py-1 px-3 rounded hover:bg-red-600 transition-all duration-300">{t.reject}</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
