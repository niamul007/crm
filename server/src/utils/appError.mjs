
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;


// APPERROR CLASS — HOW IT WORKS
// ------------------------------
// AppError extends the built-in Error class.
// This lets us create errors with a message AND 
// a status code in one shot.

// Instead of:
//   res.status(404).json({ message: "Not found" })

// We can do anywhere in the app:
//   throw new AppError("Not found", 404)
//   next(new AppError("Not found", 404))

// WHAT EACH LINE DOES:
//   super(message)        
//     → calls Error constructor, sets error message

//   this.statusCode       
//     → stores the HTTP status code (404, 401, 500)

//   this.status           
//     → "fail" for 4xx errors (client's fault)
//     → "error" for 5xx errors (server's fault)

//   this.isOperational    
//     → marks this as an expected error we created
//     → helps separate our errors from unexpected 
//       crashes in the global error handler

//   Error.captureStackTrace
//     → cleans up the error stack trace
//     → removes AppError itself from the trace
//     → makes debugging easier