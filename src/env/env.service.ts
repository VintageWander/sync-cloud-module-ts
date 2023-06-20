import { Injectable } from '@nestjs/common';
import { ConfigService, Path } from '@nestjs/config';
import { Env } from './env.entity';

@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService<Env, true>) {}

  get<P extends Path<Env>>(key: P): Env[P] {
    return this.configService.get(key, { infer: true });
  }
}
