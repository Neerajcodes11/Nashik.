import express, { Request, Response } from 'express';
import cors from 'cors';
// Define inline types for User and Vendor to avoid missing module error
type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: 'vendor' | 'customer' | 'admin';
};

type Vendor = {
  id: number;
  userId: number;
  shopName: string;
  ownerName: string;
  category: string;
  address: string;
  location: { lat: number; lng: number };
  workingHours: string;
  description: string;
  paymentMethods: string[];
  status: 'approved' | 'pending' | 'rejected';
};

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

const mockUsers: User[] = [
  { id: 1, name: 'Ramesh Patil', email: 'vendor1@example.com', phone: '9876543210', address: 'Mhasrul, Nashik', type: 'vendor' },
  { id: 2, name: 'Suresh Jadhav', email: 'vendor2@example.com', phone: '9876543211', address: 'Panchavati, Nashik', type: 'vendor' },
  { id: 3, name: 'Priya Sharma', email: 'customer1@example.com', phone: '9123456789', address: 'Tidke Nagar, Nashik', type: 'customer' },
  { id: 4, name: 'Admin User', email: 'admin@example.com', phone: '9999999999', address: 'Nashik', type: 'admin' },
  { id: 5, name: 'Gita Deshpande', email: 'vendor3@example.com', phone: '9876543212', address: 'Mhasrul, Nashik', type: 'vendor' },
  { id: 6, name: 'Anil Kumar', email: 'vendor4@example.com', phone: '9876543213', address: 'College Road, Nashik', type: 'vendor' },
  { id: 7, name: 'Sunita Rao', email: 'vendor5@example.com', phone: '9876543214', address: 'Gangapur Road, Nashik', type: 'vendor' },
  { id: 8, name: 'Vikram Singh', email: 'vendor6@example.com', phone: '9876543215', address: 'Panchavati, Nashik', type: 'vendor' },
];

const mockVendors: Vendor[] = [
  {
    id: 1,
    userId: 1,
    shopName: 'Bhavani Sweets & Snacks',
    ownerName: 'Ramesh Patil',
    category: 'Food',
    address: 'Mhasrul Link Road, Nashik',
    location: { lat: 20.036, lng: 73.813 },
    workingHours: '9:00 AM - 10:00 PM',
    description: 'Pure Veg Snacks and Cold Drinks. Famous for authentic Maharashtrian sweets.',
    paymentMethods: ['UPI', 'Cash'],
    status: 'approved'
  },
  {
    id: 2,
    userId: 2,
    shopName: 'Modern Tailors',
    ownerName: 'Suresh Jadhav',
    category: 'Tailor',
    address: 'Panchavati Karanja, Nashik',
    location: { lat: 20.009, lng: 73.793 },
    workingHours: '10:00 AM - 8:00 PM',
    description: 'Expert tailoring for men and women. Specializes in wedding attire.',
    paymentMethods: ['Cash'],
    status: 'approved'
  },
  {
    id: 3,
    userId: 5,
    shopName: 'Nashik Kirana Store',
    ownerName: 'Gita Deshpande',
    category: 'Grocery',
    address: 'Near Mhasrul Police Station, Nashik',
    location: { lat: 20.038, lng: 73.815 },
    workingHours: '8:00 AM - 9:00 PM',
    description: 'All daily needs and grocery items available. Home delivery in Mhasrul area.',
    paymentMethods: ['UPI', 'Cash', 'Card'],
    status: 'pending'
  },
  {
    id: 4,
    userId: 6,
    shopName: 'Digital World Electronics',
    ownerName: 'Anil Kumar',
    category: 'Electronics',
    address: 'Opposite BYK College, College Road, Nashik',
    location: { lat: 20.003, lng: 73.763 },
    workingHours: '10:30 AM - 9:30 PM',
    description: 'Authorised dealer for all major mobile and electronics brands.',
    paymentMethods: ['UPI', 'Card', 'EMI'],
    status: 'approved'
  },
  {
    id: 5,
    userId: 7,
    shopName: 'Wellness Medical',
    ownerName: 'Sunita Rao',
    category: 'Chemist',
    address: 'Serene Meadows, Gangapur Road, Nashik',
    location: { lat: 19.998, lng: 73.744 },
    workingHours: '24 Hours',
    description: '24/7 pharmacy with all essential medicines and health products.',
    paymentMethods: ['UPI', 'Cash', 'Card'],
    status: 'approved'
  },
  {
    id: 6,
    userId: 8,
    shopName: 'Cafe Brewpoint',
    ownerName: 'Vikram Singh',
    category: 'Cafe',
    address: 'Near Ramkund, Panchavati, Nashik',
    location: { lat: 20.008, lng: 73.791 },
    workingHours: '7:00 AM - 11:00 PM',
    description: 'A cozy cafe with a great view of the Godavari river. Serving fresh coffee, tea, and snacks.',
    paymentMethods: ['UPI', 'Card'],
    status: 'approved'
  }
];

app.get('/api/users', (req: Request, res: Response) => {
  res.json(mockUsers);
});

app.post('/api/users', (req: Request, res: Response) => {
  const newUser: User = { id: mockUsers.length + 1, ...req.body };
  mockUsers.push(newUser);
  res.status(201).json(newUser);
});

app.get('/api/vendors', (req: Request, res: Response) => {
  res.json(mockVendors);
});

app.get('/api/vendors/:id', (req: Request, res: Response) => {
  const vendor = mockVendors.find(v => v.id === parseInt(req.params.id));
  if (vendor) {
    res.json(vendor);
  } else {
    res.status(404).send('Vendor not found');
  }
});

app.post('/api/vendors', (req: Request, res: Response) => {
    const newId = mockVendors.length > 0 ? Math.max(...mockVendors.map(v => v.id)) + 1 : 1;
    const { userId, ...vendorData } = req.body;
    const newVendor: Vendor = {
        id: newId,
        userId,
        ...vendorData,
        location: { lat: 20.03, lng: 73.81 }, // Default to Mhasrul area
        workingHours: '10:00 AM - 9:00 PM',
        description: 'Newly registered vendor.',
        paymentMethods: ['Cash', 'UPI'],
        status: 'pending'
    };
    mockVendors.push(newVendor);
    res.status(201).json(newVendor);
});


app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});