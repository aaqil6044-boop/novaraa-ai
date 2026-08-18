type LogLevel = "debug" | "info" | "warn" | "error";

type LogContext = Record<string, unknown>;

function format(level: LogLevel, message: string, context?: LogContext) {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...context,
  };
  return JSON.stringify(entry);
}

export const logger = {
  debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(format("debug", message, context));
    }
  },
  info(message: string, context?: LogContext) {
    console.info(format("info", message, context));
  },
  warn(message: string, context?: LogContext) {
    console.warn(format("warn", message, context));
  },
  error(message: string, error?: unknown, context?: LogContext) {
    const errInfo =
      error instanceof Error
        ? { errorMessage: error.message, stack: error.stack }
        : { errorMessage: String(error ?? "") };

    console.error(format("error", message, { ...context, ...errInfo }));
  },
};
