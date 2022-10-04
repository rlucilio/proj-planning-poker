interface ILog {
  info(msg: string): void;
  warn(msg: string): void;
  error(msg: string): void;
  printObj(): void;
}

export class Log {
  static info (msg: string) {
    console.log(`[${new Date().toISOString()}] -> ${msg}`);
  }

  static warn (msg: string) {
    console.warn(`[${new Date().toISOString()}] -> ${msg}`);
  }

  static error (msg: string) {
    console.error(`[${new Date().toISOString()}] -> ${msg}`);
  }
}
