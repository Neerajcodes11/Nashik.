
import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { translations } from '../constants';

const DashboardPage: React.FC = () => {
  const { user, language } = useAppContext();
  const t = translations[language];

  if (!user) {
    return <div className="text-center">Please login to view your dashboard.</div>;
  }

  const renderVendorDashboard = () => (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-[#138808]">{t.vendorDashboard}</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="mb-4">Here you can manage your shop details, view statistics, and update your contact information.</p>
        <button className="bg-[#FF9933] text-white font-semibold py-2 px-4 rounded hover:bg-orange-500 transition-all duration-300">
          {t.editProfile}
        </button>
      </div>
    </div>
  );

  const renderCustomerDashboard = () => (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-[#138808]">{t.customerDashboard}</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-3">{t.favoriteShops}</h3>
        <p className="text-gray-600">You haven't added any favorite shops yet.</p>
        {/* Favorite shops list would go here */}
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t.welcome}, {user.name}!</h1>
      {user.type === 'vendor' ? renderVendorDashboard() : renderCustomerDashboard()}
    </div>
  );
};

export default DashboardPage;
