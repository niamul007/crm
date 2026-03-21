export const validateSchema = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    return res.status(400).json({
      status: "error",
      // This will now correctly show: "body.email: Invalid email"
      errors: result.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    });
  }
  req.body = result.data.body;
  next();
};


// VALIDATE MIDDLEWARE — HOW IT WORKS
// ------------------------------------
// validateSchema is a function that takes a Zod schema
// and returns an Express middleware function.

// WHY THREE PARTS (body, params, query)?
//   req.body   → data sent in POST/PUT requests (email, password, etc.)
//   req.params → data in the URL (/clients/5 → id = 5)
//   req.query  → data after ? in URL (/clients?page=1)
//   Zod validates all three at once.

// WHAT IS result.error.errors?
//   schema.safeParse() returns either:
//     { success: true,  data: { body: {...} } }
//     { success: false, error: { errors: [...] } }
  
//   result.error.errors is an array of mistakes Zod found.
//   Each mistake looks like:
//     { path: ["body", "email"], message: "Invalid email" }

// WHAT DOES err.path.join(".") DO?
//   Turns ["body", "email"] into "body.email"
//   Puts a dot between each item — readable for the frontend.

// WHY req.body = result.data.body?
//   After validation, result.data contains clean validated data.
//   We reassign req.body so the controller gets the clean version.