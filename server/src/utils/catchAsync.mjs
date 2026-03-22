// ─── UTILS/CATCHASYNC.MJS ────────────────────────────────────────
/**
 * CATCHASYNC.MJS — ASYNC ERROR WRAPPER
 * --------------------------------------
 * Wraps async controller functions to catch errors automatically.
 * Eliminates the need for try/catch in every controller.
 * 
 * WITHOUT CATCHASYNC:
 *   export const getClient = async (req, res) => {
 *     try { ... }
 *     catch (error) { res.status(500).json({...}) }
 *   }
 * 
 * WITH CATCHASYNC:
 *   export const getClient = catchAsync(async (req, res) => {
 *     // no try/catch needed
 *   })
 * 
 * HOW IT WORKS:
 *   fn(req,res,next) runs the controller
 *   .catch(next) catches any rejected promise
 *   next(error) passes it to globalErrorHandler
 */

export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;