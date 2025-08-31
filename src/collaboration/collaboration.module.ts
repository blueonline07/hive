import { Module } from '@nestjs/common';
import { CollaborationGateway } from './collaboration.gateway';
import { FilesModule } from '../files/files.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    FilesModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }),
  ],
  providers: [CollaborationGateway],
})
export class CollaborationModule {}
