const User = require('../models/userModel');

const ALLOWED_ROLES = ['user', 'admin'];

// GET /api/auth/roles
exports.listRoles = (_req, res) => {
  return res.status(200).json({ roles: ALLOWED_ROLES });
};

// GET /api/auth/users           (admin only)
exports.listUsers = async (_req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.status(200).json({ users });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to list users', error: err.message });
  }
};

// PUT /api/auth/roles    body: { userId, role }   — legacy form, kept for backwards compat
// PUT /api/auth/users/:id/role  body: { role }    — preferred RESTful form
exports.assignRole = async (req, res) => {
  try {
    const userId = req.params.id || req.body.userId;
    const { role } = req.body;
    if (!userId) return res.status(400).json({ message: 'userId is required' });
    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({ message: `role must be one of: ${ALLOWED_ROLES.join(', ')}` });
    }
    // Prevent admins from demoting themselves and getting locked out
    if (req.user && String(req.user.id) === String(userId) && role !== 'admin') {
      return res.status(400).json({ message: 'You cannot change your own admin role' });
    }
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to assign role', error: err.message });
  }
};

// DELETE /api/auth/users/:id    (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) return res.status(400).json({ message: 'user id is required' });
    if (req.user && String(req.user.id) === String(userId)) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({ message: 'User deleted', userId });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
};
