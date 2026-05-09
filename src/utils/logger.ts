type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const PREFIX = '[FormAutoFillerAI]';
const isDev = process.env.NODE_ENV !== 'production';

export const logger = {
  debug: (msg: string, ...args: unknown[]) => {
    if (isDev) console.debug(`${PREFIX} ${msg}`, ...args);
  },
  info: (msg: string, ...args: unknown[]) => {
    console.info(`${PREFIX} ${msg}`, ...args);
  },
  warn: (msg: string, ...args: unknown[]) => {
    console.warn(`${PREFIX} ${msg}`, ...args);
  },
  error: (msg: string, ...args: unknown[]) => {
    console.error(`${PREFIX} ${msg}`, ...args);
  },
};
