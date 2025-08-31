import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateFileDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @IsNumber()
  @IsNotEmpty()
  size: number;
}
