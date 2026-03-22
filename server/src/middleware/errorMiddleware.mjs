// ─── MIDDLEWARE/ERRORMIDDLEWARE.MJS ──────────────────────────────
/**
 * ERRORMIDDLEWARE.MJS — GLOBAL ERROR HANDLER
 * --------------------------------------------
 * Catches ALL errors passed via next(err) anywhere in the app.
 * Must be registered LAST in app.mjs — after all routes.
 * 
 * EXPRESS IDENTIFIES THIS AS ERROR HANDLER
 * Because it has 4 parameters: (err, req, res, next)
 * Normal middleware has 3: (req, res, next)
 * 
 * FALLBACK VALUES:
 *   statusCode defaults to 500 if not set (unexpected crash)
 *   status defaults to "error" if not set
 * 
 * WITH APPERROR:
 *   throw new AppError("Not found", 404)
 *   → err.statusCode = 404, err.status = "fail"
 * 
 * WITHOUT APPERROR (unexpected crash):
 *   → statusCode = 500, status = "error"
 */

export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

export default globalErrorHandler;