const express = require('express');
const authController = require('../controllers/authController');
const roleController = require('../controllers/roleController');
const { authenticate, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Public
router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);

// Authenticated user
router.get('/me', authenticate, authController.getCurrentUser);

// Admin-only — user management
router.get('/roles', authenticate, requireRole('admin'), roleController.listRoles);
router.get('/users', authenticate, requireRole('admin'), roleController.listUsers);

// Preferred RESTful endpoints
router.put('/users/:id/role', authenticate, requireRole('admin'), roleController.assignRole);
router.delete('/users/:id',   authenticate, requireRole('admin'), roleController.deleteUser);

// Legacy endpoint kept for backwards compatibility
router.put('/roles', authenticate, requireRole('admin'), roleController.assignRole);

module.exports = router;
