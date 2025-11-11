import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { translations } from '../constants';

const LoginPage: React.FC = () => {
  const { language, login, setPage } = useAppContext();
  const [userType, setUserType] = useState<'customer' | 'vendor'>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const t = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(email, userType);
    if (!success) {
      setError('Invalid credentials. Please try again.');
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

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6 space-x-1 border">
            <TabButton type="customer" label={t.customerLogin} />
            <TabButton type="vendor" label={t.vendorLogin} />
        </div>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              {t.email}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border border-gray-300 bg-white rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#FF9933]"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              {t.password}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border border-gray-300 bg-white rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#FF9933]"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#138808] text-white font-bold py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline transition-colors duration-300"
          >
            {t.login}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{' '}
          <button onClick={() => setPage('signup')} className="font-bold text-[#FF9933] hover:underline">
            {t.signup}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;