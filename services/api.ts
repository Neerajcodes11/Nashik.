import type { User, Vendor } from '../types';

const API_URL = 'http://localhost:4000/api';

export const addUser = async (userData: Omit<User, 'id'>): Promise<User> => {
    const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    if (!response.ok) {
        throw new Error('Failed to add user');
    }
    return response.json();
};

export const addVendor = async (vendorData: Omit<Vendor, 'id' | 'userId' | 'location' | 'workingHours' | 'description' | 'paymentMethods' | 'status'>, userId: number): Promise<Vendor> => {
    const response = await fetch(`${API_URL}/vendors`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...vendorData, userId }),
    });
    if (!response.ok) {
        throw new Error('Failed to add vendor');
    }
    return response.json();
};

export const fetchVendors = async (): Promise<Vendor[]> => {
  const response = await fetch(`${API_URL}/vendors`);
  if (!response.ok) {
    throw new Error('Failed to fetch vendors');
  }
  return response.json();
};

export const fetchVendorById = async (id: number): Promise<Vendor | undefined> => {
    const response = await fetch(`${API_URL}/vendors/${id}`);
    if (!response.ok) {
        if (response.status === 404) {
            return undefined;
        }
        throw new Error('Failed to fetch vendor');
    }
    return response.json();
};