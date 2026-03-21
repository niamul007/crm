export const catchAsync = (fn) =>{
    return (req,res,next) =>{
        fn(req,res,next).catch(next)
    }
}

export default catchAsync;



// CATCHASYNC — HOW IT WORKS
// --------------------------
// Takes an async controller function (fn) and wraps it.

// Instead of try/catch in every controller:
//   export const getClient = async (req, res) => {
//     try { ... } 
//     catch (error) { res.status(500)... }
//   }

// You wrap it with catchAsync:
//   export const getClient = catchAsync(async (req, res) => {
//     // no try/catch needed
//     // any error auto goes to global error handler
//   })

// .catch(next) → catches any rejected promise and 
// passes the error to next() → global error handler