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

export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_URL}/users`);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
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
export const mockUsers: User[] = [
  {
    id: 1,
    name: "Test Vendor",
    email: "vendor@test.com",
    phone: "9876543210",
    address: "Mhasrul, Nashik",
    type: "vendor"
  },
  {
    id: 2,
    name: "Test Customer",
    email: "customer@test.com",
    phone: "9123456789",
    address: "Panchavati, Nashik",
    type: "customer"
  },
  {
    id: 3,
    name: "Admin User",
    email: "admin@test.com",
    phone: "9999999999",
    address: "Nashik",
    type: "admin"
  }
];
