import { LogLevel } from '@nestjs/common';
import { boolean } from 'boolean';

export const logLevel: LogLevel[] = ['debug', 'log', 'warn', 'error'];
export const envLog: LogLevel[] = process.env.LOG
  ? boolean(process.env.LOG)
    ? logLevel
    : []
  : logLevel;
