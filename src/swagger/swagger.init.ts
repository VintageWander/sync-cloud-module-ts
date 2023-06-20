import { DocumentBuilder } from '@nestjs/swagger';

export const initSwagger = () =>
  new DocumentBuilder()
    .setTitle('Sync Multicloud Module')
    .setDescription('The API for Sync Multicloud Module')
    .setVersion('0.0.1')
    .build();
