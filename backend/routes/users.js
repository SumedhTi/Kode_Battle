import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { validateUserUpdate } from '../utils/validation.js';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';

const router = express.Router();

// All user routes require authentication
router.use(authenticateToken);

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', validateUserUpdate, updateUser);
router.delete('/:id', deleteUser);

export default router;