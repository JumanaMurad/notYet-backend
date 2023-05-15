const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
    const message=`invalid ${err.path}: ${err.value}.`;
    return new AppError(message,400);
}

const handleDuplicateFielsDB = err => {
    
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
    const message=`Duplicate field value: ${value}. Please use another value`;
    return new AppError(message,400);
}

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `invalid input data ${errors.join('. ')}`;
    return new AppError(message,400);
}

const sendErrorDev = (err,res)=>{
    res.status(err.statusCode).json({
        status:err.status,
        error:err,
        message:err.message,
        stack:err.stack
    });
}

const sendErrorProd = (err,res)=>{
    // send message to client
    if(err.isOperational){
        res.status(err.statusCode).json({
            status:err.status,
            message:err.message,
        });
    //programming error
    }else {
        //1)log error
        console.error('ERROR',err);
        //2)send message
        res.status(500).json({
            status:'error',
            message:'something went wrong '
        });
    }
}

module.exports = (err,req,res,next)=>{
    //console.log(err.stack);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err,res);

    }else if(process.env.NODE_ENV === 'production'){
        let error = {...err};
        if(error.name === 'CastErorr')  error = handleCastErrorDB(error);
        if(error.code === 11000) error = handleDuplicateFielsDB(error);
        if(error.name === 'ValidationError') error = handleValidationErrorDB(error);
        sendErrorProd(error,res);
     }

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
};