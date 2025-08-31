import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateFileDto } from './dto/create-file.dto';
import { ShareFileDto } from './dto/share-file.dto';

// Define the request type with user property
interface RequestWithUser {
  user: {
    id: string;
    email: string;
  };
}

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  createFile(
    @Request() req: RequestWithUser,
    @Body() createFileDto: CreateFileDto,
  ) {
    return this.filesService.createFile(req.user.id, createFileDto);
  }

  @Get()
  getMyFiles(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Request() _req: RequestWithUser,
  ) {
    // This would be implemented to get all files the user has access to
    // For brevity, not implementing in this minimal setup
    return { message: 'Not implemented in minimal setup' };
  }

  @Get(':id')
  getFileById(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.filesService.getFileById(req.user.id, id);
  }

  @Post(':id/share')
  shareFile(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() shareFileDto: ShareFileDto,
  ) {
    return this.filesService.shareFile(
      req.user.id,
      id,
      shareFileDto.targetUserId,
      shareFileDto.permission,
    );
  }
}
