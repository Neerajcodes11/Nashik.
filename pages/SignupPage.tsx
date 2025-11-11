import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { translations, VENDOR_CATEGORIES } from '../constants';
import { addUser, addVendor } from '../services/api';

const SignupPage: React.FC = () => {
  const { language, setPage } = useAppContext();
  const [userType, setUserType] = useState<'customer' | 'vendor'>('customer');
  const t = translations[language];

  // State for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [shopName, setShopName] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newUser = await addUser({
          name,
          email,
          phone,
          address,
          type: userType,
      });

      if (userType === 'vendor') {
        if (!shopName || !category) {
            alert('Shop Name and Category are required for vendors.');
            return;
        }
        await addVendor({
            shopName,
            ownerName: name,
            category,
            address, // Using user address as shop address for simplicity
        }, newUser.id);
      }

      alert('Signup successful! Please login.');
      setPage('login');
    } catch (error) {
        console.error("Signup failed:", error);
        alert('An error occurred during signup. Please try again.');
    }
  };
  
  const TabButton: React.FC<{ type: 'customer' | 'vendor', label: string }> = ({ type, label }) => (
      <button
        onClick={() => setUserType(type)}
        className={`w-1/2 py-2.5 text-sm font-semibold leading-5 text-center transition-all duration-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF9933] ${userType === type ? 'bg-white shadow text-[#138808]' : 'text-gray-700 hover:bg-white/80'}`}
      >
        {label}
      </button>
  );

  const commonFields = (
    <>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">{t.name}</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} required className="shadow appearance-none border border-gray-300 bg-white rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#FF9933]" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">{t.email}</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="shadow appearance-none border border-gray-300 bg-white rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#FF9933]" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">{t.phone}</label>
        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required className="shadow appearance-none border border-gray-300 bg-white rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#FF9933]" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">{t.password}</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="shadow appearance-none border border-gray-300 bg-white rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#FF9933]" />
      </div>
       <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">{t.address}</label>
        <textarea value={address} onChange={e => setAddress(e.target.value)} required className="shadow appearance-none border border-gray-300 bg-white rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#FF9933]" />
      </div>
    </>
  );

  return (
    <div className="max-w-lg mx-auto mt-10">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6 space-x-1 border">
            <TabButton type="customer" label={t.customerSignup} />
            <TabButton type="vendor" label={t.vendorSignup} />
        </div>
        <form onSubmit={handleSubmit}>
          {commonFields}
          {userType === 'vendor' && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">{t.shopName}</label>
                <input type="text" value={shopName} onChange={e => setShopName(e.target.value)} required className="shadow appearance-none border border-gray-300 bg-white rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#FF9933]" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">{t.category}</label>
                <select value={category} onChange={e => setCategory(e.target.value)} required className="shadow appearance-none border border-gray-300 bg-white rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#FF9933]">
                  <option value="">Select Category</option>
                  {VENDOR_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="mb-4 p-4 border rounded-md bg-gray-50 text-center">
                <p className="text-sm font-semibold text-gray-700">Pin your shop location on the map.</p>
                <p className="text-xs text-gray-500 mt-1">(Map functionality placeholder)</p>
                <button type="button" className="mt-2 text-sm bg-[#FF9933] text-white font-semibold py-1 px-3 rounded hover:bg-orange-500 transition-all duration-300">
                  Select Location
                </button>
              </div>
            </>
          )}
          <button
            type="submit"
            className="w-full bg-[#138808] text-white font-bold py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline transition-colors duration-300"
          >
            {t.signup}
          </button>
        </form>
         <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <button onClick={() => setPage('login')} className="font-bold text-[#FF9933] hover:underline">
            {t.login}
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;