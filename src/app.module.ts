import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EnvModule } from './env/env.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [EnvModule, HttpModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
