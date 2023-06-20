import { Test, TestingModule } from '@nestjs/testing';
import { EnvService } from './env.service';
import { envConsts } from './env.entity';
import { ConfigModule } from '@nestjs/config';
import { validate } from './env.validate';

describe('EnvService', () => {
  let service: EnvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          validate,
        }),
      ],
      providers: [EnvService],
    }).compile();

    service = module.get<EnvService>(EnvService);
  });

  it('Env fields when retrieved should be type-safe', () => {
    let port = service.get(envConsts.PORT);
    expect(typeof port).toBe('number');
    expect(port).not.toBe(0);

    let env_service = service.get(envConsts.SERVICE);
    expect(typeof env_service).toBe('string');
    expect(env_service).not.toBe('');
  });
});
