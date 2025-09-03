import { validationResult } from 'express-validator';
import * as fileService from '../services/fileService.js';

/**
 * Controller for handling file uploads to MinIO storage
 * 
 * This endpoint accepts a multipart/form-data request with a file field named "file".
 * The file is uploaded to MinIO storage and its metadata is stored in the database.
 * 
 * @route POST /api/files/upload
 * @param {Object} req - Express request object
 * @param {Object} req.file - Uploaded file object from multer middleware
 * @param {Buffer} req.file.buffer - File data as buffer
 * @param {string} req.file.originalname - Original file name
 * @param {string} req.file.mimetype - MIME type of the file
 * @param {Object} req.user - Authenticated user information
 * @param {string} req.user.id - User ID of the authenticated user
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with file information or error
 */
export const uploadFile = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const file = await fileService.uploadFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      req.user.id
    );
    
    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        id: file.id,
        name: file.name,
        size: file.size,
        mimeType: file.mimeType,
        createdAt: file.createdAt
      }
    });
  } catch (error) {
    console.error('Error in uploadFile controller:', error);
    res.status(500).json({ message: 'Server error while uploading file' });
  }
};

export default {
  uploadFile
};