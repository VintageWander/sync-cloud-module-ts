import { IsBoolean, IsEnum, IsNumber, IsUrl } from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
}

export class Env {
  @IsNumber()
  PORT: number = 0;

  @IsUrl({
    require_tld: false,
    protocols: ['http', 'https'],
  })
  SERVICE: string = '';

  @IsEnum(Environment)
  ENVIRONMENT: Environment = Environment.Development;

  @IsBoolean()
  LOG: boolean = true;
}

export enum envConsts {
  PORT = 'PORT',
  SERVICE = 'SERVICE',
  ENVIRONMENT = 'ENVIRONMENT',
  LOG = 'LOG',
}
