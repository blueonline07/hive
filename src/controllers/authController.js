import * as authService from '../services/authService.js';

/**
 * Register a new user
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;
    
    const result = await authService.register({
      email,
      password,
      name
    });
    
    res.status(201).json(result);
  } catch (error) {
    if (error.message === 'User already exists') {
      return res.status(400).json({ message: error.message });
    }
    
    next(error);
  }
}

/**
 * Login a user
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    
    const result = await authService.login({
      email,
      password
    });
    
    res.json(result);
  } catch (error) {
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ message: error.message });
    }
    
    next(error);
  }
}

/**
 * Get current user profile
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export function getProfile(req, res) {
  // User is already set by the auth middleware
  res.json({
    user: req.user
  });
}
