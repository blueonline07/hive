import express from 'express';
import * as authController from '../controllers/authController.js';
import { registerValidation, loginValidation } from '../middlewares/validators.js';
import authenticate from '../middlewares/auth.js';

const router = express.Router();

/**
 * @route   POST /auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerValidation, authController.register);

/**
 * @route   POST /auth/login
 * @desc    Login a user
 * @access  Public
 */
router.post('/login', loginValidation, authController.login);

/**
 * @route   GET /auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticate, authController.getProfile);

export default router;
