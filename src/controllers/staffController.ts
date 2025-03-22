import { Request, Response } from 'express';
import { Staff, IStaff } from '../models/Staff';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Get all staff members
export const getStaff = async (req: Request, res: Response) => {
  try {
    const staff = await Staff.find().select('-password');
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching staff members' });
  }
};

// Get a single staff member
export const getStaffMember = async (req: Request, res: Response) => {
  try {
    const staff = await Staff.findById(req.params.id).select('-password');
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching staff member' });
  }
};

// Create a new staff member
export const createStaff = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Check if email already exists
    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const staff = new Staff({
      name,
      email,
      password,
      role,
      phone,
    });

    await staff.save();
    
    // Create a new object without the password field
    const { password: _, ...staffWithoutPassword } = staff.toObject();
    
    res.status(201).json(staffWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Error creating staff member' });
  }
};

// Update a staff member
export const updateStaff = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, phone } = req.body;
    const updateData: any = { name, email, role, phone };

    // Only update password if provided
    if (password) {
      updateData.password = password;
    }

    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Error updating staff member' });
  }
};

// Delete a staff member
export const deleteStaff = async (req: Request, res: Response) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    res.json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting staff member' });
  }
};

// Staff login
export const loginStaff = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find staff member
    const staff = await Staff.findOne({ email });
    if (!staff) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await staff.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: staff._id,
        email: staff.email,
        role: staff.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return staff data without password using destructuring
    const { password: _, ...staffData } = staff.toObject();

    res.json({
      token,
      staff: staffData
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
}; 