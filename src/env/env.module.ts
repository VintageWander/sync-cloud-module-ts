import { Module } from '@nestjs/common';
import { EnvService } from './env.service';
import { ConfigModule } from '@nestjs/config';
import { validate } from './env.validate';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
    }),
  ],
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
