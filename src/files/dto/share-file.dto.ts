import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { Permission } from '../../common/enums/permission.enum';

export class ShareFileDto {
  @IsUUID()
  @IsNotEmpty()
  targetUserId: string;

  @IsEnum(Permission)
  @IsNotEmpty()
  permission: Permission;
}
