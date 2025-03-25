import express from 'express';
import {
  getStaff,
  getStaffMember,
  createStaff,
  updateStaff,
  deleteStaff,
  loginStaff,
  recordAttendance,
  getStaffAttendance,
  getAllStaffAttendanceByDate
} from '../controllers/staffController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/login', loginStaff);

// Protected routes (require authentication)
router.get('/', authenticateToken, getStaff);
router.post('/', authenticateToken, createStaff);

// Attendance routes - these must come BEFORE the /:id routes
router.get('/attendance/date', authenticateToken, getAllStaffAttendanceByDate);

// Staff member specific routes
router.get('/:id', authenticateToken, getStaffMember);
router.put('/:id', authenticateToken, updateStaff);
router.delete('/:id', authenticateToken, deleteStaff);

// Staff attendance routes
router.post('/:staffId/attendance', authenticateToken, recordAttendance);
router.get('/:staffId/attendance', authenticateToken, getStaffAttendance);

export default router; 