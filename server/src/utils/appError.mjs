// ─── UTILS/APPERROR.MJS ──────────────────────────────────────────
/**
 * APPERROR.MJS — CUSTOM ERROR CLASS
 * -----------------------------------
 * Extends built-in Error to include a statusCode.
 * Lets you create descriptive errors anywhere in the app.
 * 
 * USAGE:
 *   throw new AppError("Client not found", 404)
 *   next(new AppError("Unauthorized", 401))
 * 
 * PROPERTIES:
 *   message        → error description (from Error)
 *   statusCode     → HTTP status code (404, 401, 500...)
 *   status         → "fail" for 4xx, "error" for 5xx
 *   isOperational  → true = expected error we created
 *                    helps separate our errors from crashes
 * 
 * WHY startsWith("4")?
 *   4xx errors are client mistakes → "fail"
 *   5xx errors are server mistakes → "error"
 */

class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // sets this.message
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    // Removes AppError itself from the stack trace — cleaner debugging
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;