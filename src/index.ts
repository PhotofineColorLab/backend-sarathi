import express, { response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import staffRoutes from './routes/staffRoutes';
import { Staff } from './models/Staff';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/admin-dash')
  .then(async () => {
    console.log('Connected to MongoDB');

    // Initialize admin user if not exists
    const adminExists = await Staff.findOne({ email: 'admin@electrical.com' });
    if (!adminExists) {
      await Staff.create({
        name: 'Admin User',
        email: 'admin@electrical.com',
        password: 'admin123',
        role: 'admin',
        phone: '+1 (555) 123-4567',
      });
      console.log('Admin user created');
    }

    // Initialize Special Staff if not exists
    const specialStaffExists = await Staff.findOne({ email: 'special@electrical.com' });
    if (!specialStaffExists) {
      await Staff.create({
        name: 'Special Staff',
        email: 'special@electrical.com',
        password: 'special123',
        role: 'staff',
        phone: '+1 (555) 999-9999',
      });
      console.log('Special Staff created');
    }
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/staff', staffRoutes);
app.use('/', (req, res) => {res.json("Welcome to Sarathi")});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 