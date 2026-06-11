"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, req, res, next) {
    console.error('Global Error Handler:', err);
    if (err.name === 'ZodError') {
        return res.status(400).json({
            error: 'Validation Error',
            details: err.errors
        });
    }
    return res.status(500).json({
        error: 'Internal Server Error',
        message: err.message || 'Something went wrong on the server.'
    });
}
