import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class DeleteDataRequest {
  @ApiProperty()
  @IsString()
  key: string = '';

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Min(0)
  ttl?: number = 0;
}
