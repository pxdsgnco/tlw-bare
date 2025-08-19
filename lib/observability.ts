// Basic observability implementation for the search modal
// This is a simplified version - you can expand it based on your needs

interface LogContext {
  readonly [key: string]: unknown;
}

class SimpleLogger {
  createChildLogger(context: LogContext) {
    return {
      info: (message: string, additionalContext?: LogContext) => {
        if (process.env.NODE_ENV === 'development') {
          console.log(`[INFO] ${message}`, { ...context, ...additionalContext });
        }
      },
      error: (message: string, additionalContext?: LogContext) => {
        console.error(`[ERROR] ${message}`, { ...context, ...additionalContext });
      },
      warn: (message: string, additionalContext?: LogContext) => {
        console.warn(`[WARN] ${message}`, { ...context, ...additionalContext });
      },
      debug: (message: string, additionalContext?: LogContext) => {
        if (process.env.NODE_ENV === 'development') {
          console.debug(`[DEBUG] ${message}`, { ...context, ...additionalContext });
        }
      }
    };
  }

  info(message: string, context?: LogContext) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[INFO] ${message}`, context);
    }
  }

  error(message: string, context?: LogContext) {
    console.error(`[ERROR] ${message}`, context);
  }

  warn(message: string, context?: LogContext) {
    console.warn(`[WARN] ${message}`, context);
  }

  debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, context);
    }
  }
}

export const logger = new SimpleLogger();