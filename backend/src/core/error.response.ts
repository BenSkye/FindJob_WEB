// const StatusCode = { FORBIDDEN: 403, CONFLICT: 409 };

// const ReasonStatusCode = { FORBIDDEN: 'Bad request error', CONFLICT: 'Conflict error' };

import { StatusCodes, ReasonPhrases } from '../utils/httpStatusCode';
class ErrorResponse extends Error {
    status: any;
    constructor(message: any, status: any) {
        super(message);
        this.status = status;

        console.log('statusCode', status);
        // Error.captureStackTrace(this, this.constructor)

    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.CONFLICT, statusCode = StatusCodes.CONFLICT) {
        super(message, statusCode);
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.BAD_REQUEST, statusCode = StatusCodes.BAD_REQUEST) {
        super(message, statusCode);
    }
}

class AuthFailureError extends ErrorResponse {
    constructor(message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED) {
        super(message, statusCode);
    }
}

class NotFoundError extends ErrorResponse {
    constructor(message = ReasonPhrases.NOT_FOUND, statusCode = StatusCodes.NOT_FOUND) {
        super(message, statusCode);
    }
}

class ForbiddenError extends ErrorResponse {
    constructor(message = ReasonPhrases.FORBIDDEN, statusCode = StatusCodes.FORBIDDEN) {
        super(message, statusCode);
    }
}

export { BadRequestError, ConflictRequestError, AuthFailureError, NotFoundError, ForbiddenError };