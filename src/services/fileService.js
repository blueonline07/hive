import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';
import { minioClient } from '../config/minio.js';
import { prisma } from '../models/prisma.js';

/**
 * Upload a file to MinIO
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} fileName - Original file name
 * @param {string} mimeType - File MIME type
 * @param {string} userId - User ID of the uploader
 * @returns {Promise<Object>} Uploaded file metadata
 */
export async function uploadFile(fileBuffer, fileName, mimeType, userId) {
  try {
    // Generate a unique object name
    const objectName = `${uuidv4()}-${fileName}`;
    const bucketName = process.env.MINIO_BUCKET || 'hive-files';
    
    // Ensure bucket exists
    const bucketExists = await minioClient.bucketExists(bucketName);
    if (!bucketExists) {
      await minioClient.makeBucket(bucketName);
    }
    
    // Convert buffer to readable stream
    const fileStream = Readable.from(fileBuffer);
    
    // Upload to MinIO
    await minioClient.putObject(
      bucketName,
      objectName,
      fileStream,
      fileBuffer.length,
      { 'Content-Type': mimeType }
    );
    
    // Save file metadata to database
    const file = await prisma.file.create({
      data: {
        name: fileName,
        key: objectName,
        mimeType,
        size: fileBuffer.length,
        bucket: bucketName,
        owner: {
          connect: { id: userId }
        }
      }
    });
    
    return file;
  } catch (error) {
    console.error('Error uploading file to MinIO:', error);
    throw error;
  }
}

export default {
  uploadFile
};