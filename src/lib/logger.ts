const dev = import.meta.env.DEV;

export const logger = {
  debug: (...args: unknown[]) => {
    if (dev) console.debug(...args);
  },
  info: (...args: unknown[]) => {
    if (dev) console.info(...args);
  },
  warn: (...args: unknown[]) => {
    console.warn(...args);
  },
  error: (...args: unknown[]) => {
    console.error(...args);
  },
};
