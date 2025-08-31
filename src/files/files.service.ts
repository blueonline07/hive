import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { CreateFileDto } from './dto/create-file.dto';
import { Permission } from '../common/enums/permission.enum';
import * as minio from 'minio';

@Injectable()
export class FilesService {
  private minioClient: minio.Client;
  private bucketName: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const endPoint = this.configService.get<string>('MINIO_ENDPOINT');
    const port = this.configService.get<number>('MINIO_PORT');
    const accessKey = this.configService.get<string>('MINIO_ACCESS_KEY');
    const secretKey = this.configService.get<string>('MINIO_SECRET_KEY');
    this.bucketName =
      this.configService.get<string>('MINIO_BUCKET_NAME') || 'weave-files';

    if (!endPoint || !accessKey || !secretKey) {
      throw new Error(
        'MinIO configuration is incomplete. Check your environment variables.',
      );
    }

    this.minioClient = new minio.Client({
      endPoint,
      port: port || 9000,
      useSSL: false,
      accessKey,
      secretKey,
    });
  }

  async createBucketIfNotExists() {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to create bucket: ${errorMessage}`);
    }
  }

  async getPresignedUrl(
    type: 'upload' | 'download',
    fileId: string,
    // These parameters are not used in this minimal implementation but could be useful in a more advanced one
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _fileName?: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _fileType?: string,
  ) {
    try {
      await this.createBucketIfNotExists();

      if (type === 'upload') {
        return this.minioClient.presignedPutObject(
          this.bucketName,
          fileId,
          60 * 60, // 1 hour expiry
        );
      } else {
        return this.minioClient.presignedGetObject(
          this.bucketName,
          fileId,
          60 * 60, // 1 hour expiry
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to generate presigned URL: ${errorMessage}`);
    }
  }

  async createFile(userId: string, createFileDto: CreateFileDto) {
    try {
      const { name, mimeType, size } = createFileDto;

      // Create file entry in database
      const file = await this.prisma.file.create({
        data: {
          name,
          mimeType,
          size,
          path: '', // Will be updated after upload
          owner: {
            connect: { id: userId },
          },
          fileAccess: {
            create: {
              permission: Permission.WRITE,
              user: {
                connect: { id: userId },
              },
            },
          },
        },
      });

      // Generate presigned URL for upload
      const uploadUrl = await this.getPresignedUrl(
        'upload',
        file.id,
        name,
        mimeType,
      );

      // Update file path
      await this.prisma.file.update({
        where: { id: file.id },
        data: {
          path: file.id,
        },
      });

      return {
        file,
        uploadUrl,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to create file: ${errorMessage}`);
    }
  }

  async getFileById(userId: string, fileId: string) {
    try {
      // Check if user has access to file
      const fileAccess = await this.prisma.fileAccess.findUnique({
        where: {
          fileId_userId: {
            fileId,
            userId,
          },
        },
      });

      if (!fileAccess) {
        throw new UnauthorizedException(
          'File not found or you do not have permission',
        );
      }

      // Get file details
      const file = await this.prisma.file.findUnique({
        where: { id: fileId },
        include: {
          owner: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          fileAccess: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!file) {
        throw new NotFoundException('File not found');
      }

      // Generate download URL
      const downloadUrl = await this.getPresignedUrl(
        'download',
        file.id,
        file.name,
        file.mimeType,
      );

      return {
        file,
        downloadUrl,
      };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to get file: ${errorMessage}`);
    }
  }

  async shareFile(
    userId: string,
    fileId: string,
    targetUserId: string,
    permission: Permission,
  ) {
    try {
      // Check if user owns the file
      const file = await this.prisma.file.findFirst({
        where: {
          id: fileId,
          ownerId: userId,
        },
      });

      if (!file) {
        throw new UnauthorizedException(
          'File not found or you are not the owner',
        );
      }

      // Create file access
      return this.prisma.fileAccess.upsert({
        where: {
          fileId_userId: {
            fileId,
            userId: targetUserId,
          },
        },
        update: {
          permission,
        },
        create: {
          file: {
            connect: { id: fileId },
          },
          user: {
            connect: { id: targetUserId },
          },
          permission,
        },
      });
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to share file: ${errorMessage}`);
    }
  }
}
