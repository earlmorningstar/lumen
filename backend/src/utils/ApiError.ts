export class ApiError extends Error {
    public statusCode: number;
    public code?: string;
    public isOperational: boolean;

    constructor(statusCode: number, message: string, code?: string, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, ApiError.prototype);
    }

    static badRequest(message: string, code?: string) {
        return new ApiError(400, message, code);
    }

    static unauthorized(message = 'Authentication required') {
        return new ApiError(401, message);
    }

    static forbidden(message = 'Forbidden') {
        return new ApiError(403, message);
    }

    static notFound(resource = 'Resource') {
        return new ApiError(404, `${resource} not found`);
    }

    static conflict(message: string) {
        return new ApiError(409, message);
    }

    static unprocessable(message = 'Unprocessable entity') {
        return new ApiError(422, message);
    }

    static tooManyRequests() {
        return new ApiError(429, 'Too many requests');
    }

    static internal(message = 'Internal server error') {
        return new ApiError(500, message, undefined, false);
    }
}