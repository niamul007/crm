// ─── VALIDATE.MJS ────────────────────────────────────────────────
/**
 * VALIDATE.MJS — ZOD VALIDATION MIDDLEWARE FACTORY
 * --------------------------------------------------
 * Takes a Zod schema and returns an Express middleware.
 * Runs before the controller to validate incoming data.
 * 
 * WHY A FACTORY FUNCTION?
 * (schema) => (req, res, next)
 * The outer function takes the schema.
 * The inner function is the actual middleware.
 * This lets us reuse one function for any schema.
 * 
 * WHAT IT VALIDATES:
 *   body   → POST/PUT data from frontend
 *   params → URL parameters like :id
 *   query  → URL query strings like ?page=1
 * 
 * ON SUCCESS:
 *   req.body is replaced with clean validated data
 *   next() passes control to the controller
 * 
 * ON FAILURE:
 *   Returns 400 with array of field errors
 *   Controller never runs
 * 
 * ERROR FORMAT:
 *   { field: "body.email", message: "Invalid email" }
 *   err.path.join(".") turns ["body","email"] into "body.email"
 */

export const validateSchema = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    return res.status(400).json({
      status: "error",
      errors: result.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    });
  }

  // Replace req.body with clean validated data
  req.body = result.data.body;
  next();
};