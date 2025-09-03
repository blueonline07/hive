import express from 'express';
import multer from 'multer';
import * as fileController from '../controllers/fileController.js';
import authMiddleware from '../middlewares/auth.js';

/**
 * Express router for handling file operations
 * @module routes/files
 */
const router = express.Router();

/**
 * Configure multer middleware for file uploads
 * 
 * Uses memory storage to store the file as a buffer in memory
 * Sets a file size limit of 10MB to prevent large file uploads
 */
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

/**
 * Route for uploading files to MinIO storage
 * 
 * @name POST /api/files/upload
 * @function
 * @memberof module:routes/files
 * @inner
 * @param {middleware} authMiddleware - Authenticates the user and adds user info to req.user
 * @param {middleware} upload.single - Multer middleware that processes a single file with field name 'file'
 * @param {function} fileController.uploadFile - Controller function that handles the file upload
 */
router.post(
  '/upload',
  authMiddleware,
  upload.single('file'),
  fileController.uploadFile
);

export default router;