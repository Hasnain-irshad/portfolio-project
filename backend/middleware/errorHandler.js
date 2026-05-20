import multer from 'multer';

// Custom Error Classes
export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    constructor(message) {
        super(message, 400);
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized access') {
        super(message, 401);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = 'Access forbidden') {
        super(message, 403);
    }
}

/**
 * Normalize known framework/library errors into something useful for the
 * client (and surface the real reason instead of a generic "Something went
 * wrong!"). Returns a fresh AppError when we recognize the shape.
 */
const normalizeError = (err) => {
    // Mongoose ValidationError — field-level rules failed
    if (err?.name === 'ValidationError' && err?.errors) {
        const messages = Object.values(err.errors)
            .map((e) => e.message)
            .filter(Boolean);
        return new ValidationError(messages.join('; ') || 'Validation failed');
    }

    // Mongoose CastError — bad type (e.g. invalid ObjectId)
    if (err?.name === 'CastError') {
        return new ValidationError(`Invalid value for ${err.path}: ${err.value}`);
    }

    // Mongoose duplicate key
    if (err?.code === 11000 && err?.keyValue) {
        const field = Object.keys(err.keyValue)[0];
        return new ValidationError(`Duplicate value for field "${field}"`);
    }

    // JSON parse error (bad payload from a FormData JSON string, etc.)
    if (err instanceof SyntaxError && 'body' in err) {
        return new ValidationError('Malformed JSON in request body');
    }
    if (err instanceof SyntaxError && /JSON/i.test(err.message || '')) {
        return new ValidationError(`Malformed JSON: ${err.message}`);
    }

    // Multer errors (file uploads)
    if (err instanceof multer.MulterError) {
        const map = {
            LIMIT_FILE_SIZE: 'File is too large (max 10 MB per file)',
            LIMIT_FILE_COUNT: 'Too many files uploaded',
            LIMIT_UNEXPECTED_FILE: `Unexpected file field "${err.field}"`,
            LIMIT_PART_COUNT: 'Too many form parts'
        };
        return new ValidationError(map[err.code] || err.message || 'File upload failed');
    }

    return null;
};

// Global Error Handler Middleware
export const errorHandler = (err, req, res, next) => {
    const normalized = normalizeError(err) || err;
    normalized.statusCode = normalized.statusCode || 500;
    normalized.status = normalized.status || 'error';

    // Always log the original error for the server operator
    console.error('💥', req.method, req.originalUrl, '→', err?.name, err?.message);
    if (process.env.NODE_ENV !== 'production') {
        console.error(err?.stack);
    }

    if (process.env.NODE_ENV === 'development') {
        return res.status(normalized.statusCode).json({
            success: false,
            status: normalized.status,
            error: err,
            message: normalized.message,
            stack: err?.stack
        });
    }

    // Production — return a useful message, but never the stack.
    res.status(normalized.statusCode).json({
        success: false,
        status: normalized.status,
        message: normalized.message || 'Request failed'
    });
};

// Async error wrapper
export const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

// 404 Not Found Handler
export const notFound = (req, res, next) => {
    const error = new NotFoundError(`Route ${req.originalUrl} not found`);
    next(error);
};
