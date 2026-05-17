/**
 * Sync Logger Utility
 * Structured logging untuk sinkronisasi data
 */

export interface LogContext {
  [key: string]: any;
}

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG'
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  operation: string;
  message: string;
  context?: LogContext;
}

export class SyncLogger {
  private static logs: LogEntry[] = [];

  /**
   * Get current timestamp dalam format ISO
   */
  private static getTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Log dengan level INFO
   */
  static info(operation: string, message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, operation, message, context);
  }

  /**
   * Log dengan level WARN
   */
  static warn(operation: string, message: string, context?: LogContext): void {
    this.log(LogLevel.WARN, operation, message, context);
  }

  /**
   * Log dengan level ERROR
   */
  static error(operation: string, message: string, context?: LogContext): void {
    this.log(LogLevel.ERROR, operation, message, context);
  }

  /**
   * Log dengan level DEBUG
   */
  static debug(operation: string, message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, operation, message, context);
  }

  /**
   * Core logging method
   */
  private static log(
    level: LogLevel,
    operation: string,
    message: string,
    context?: LogContext
  ): void {
    const timestamp = this.getTimestamp();
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    const logMessage = `[${timestamp}] ${level} [${operation}] ${message}${contextStr}`;

    // Console output
    switch (level) {
      case LogLevel.ERROR:
        console.error(logMessage);
        break;
      case LogLevel.WARN:
        console.warn(logMessage);
        break;
      case LogLevel.DEBUG:
        console.debug(logMessage);
        break;
      case LogLevel.INFO:
      default:
        console.log(logMessage);
        break;
    }

    // Store in memory (for later analysis)
    this.logs.push({
      timestamp,
      level,
      operation,
      message,
      context
    });
  }

  /**
   * Get all logs
   */
  static getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs filtered by level
   */
  static getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Get logs filtered by operation
   */
  static getLogsByOperation(operation: string): LogEntry[] {
    return this.logs.filter(log => log.operation === operation);
  }

  /**
   * Clear logs
   */
  static clearLogs(): void {
    this.logs = [];
  }

  /**
   * Get error logs
   */
  static getErrors(): LogEntry[] {
    return this.getLogsByLevel(LogLevel.ERROR);
  }

  /**
   * Get summary of logs
   */
  static getSummary(): { total: number; info: number; warn: number; error: number; debug: number } {
    return {
      total: this.logs.length,
      info: this.logs.filter(l => l.level === LogLevel.INFO).length,
      warn: this.logs.filter(l => l.level === LogLevel.WARN).length,
      error: this.logs.filter(l => l.level === LogLevel.ERROR).length,
      debug: this.logs.filter(l => l.level === LogLevel.DEBUG).length
    };
  }
}
