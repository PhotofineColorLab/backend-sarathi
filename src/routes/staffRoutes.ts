import express from 'express';
import {
  getStaff,
  getStaffMember,
  createStaff,
  updateStaff,
  deleteStaff,
  loginStaff,
} from '../controllers/staffController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/login', loginStaff);

// Protected routes (require authentication)
router.get('/', authenticateToken, getStaff);
router.get('/:id', authenticateToken, getStaffMember);
router.post('/', authenticateToken, createStaff);
router.put('/:id', authenticateToken, updateStaff);
router.delete('/:id', authenticateToken, deleteStaff);

export default router; 