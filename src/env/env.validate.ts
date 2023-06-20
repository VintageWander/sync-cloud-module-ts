import { plainToClass } from 'class-transformer';
import { Env } from './env.entity';
import { validateSync } from 'class-validator';
import { boolean } from 'boolean';

export function validate(env: Record<string, unknown>): Env {
  if (env.PORT) {
    env.PORT = parseInt(env.PORT as string);
  }

  if (env.LOG) {
    env.LOG = boolean(env.LOG as string);
  }

  const parsedEnv = plainToClass(Env, env);

  const errors = validateSync(parsedEnv, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    parsedEnv.LOG = false;
    console.error(errors);
  }

  return parsedEnv;
}
