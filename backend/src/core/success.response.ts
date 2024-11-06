// const StatusCode = {
//     OK: 200,
//     CREATED: 201,
// };

// const ReasonStatusCode = {
//     CREATED: "Created!",
//     OK: "Success",
// };


import { StatusCodes, ReasonPhrases } from '../utils/httpStatusCode';

class SuccessResponse {
    message: string;
    status: number;
    metadata: Record<string, any>;
    constructor({
        message,
        statusCode = StatusCodes.OK,
        reasonStatusCode = ReasonPhrases.OK,
        metadata = {},
    }: {
        message: string;
        statusCode?: number;
        reasonStatusCode?: string;
        metadata?: any;
    }) {
        this.message = !message ? reasonStatusCode : message;
        this.status = statusCode;
        this.metadata = metadata;
    }

    send(res: any, headers = {}) {
        return res.status(this.status).json(this);
    }
}

class OK extends SuccessResponse {
    constructor({ message, metadata }: { message: string; metadata: any }) {
        super({ message, metadata });
    }
}

class CREATED extends SuccessResponse {
    options: any;
    constructor({
        options = {},
        message,
        statusCode = StatusCodes.CREATED,
        reasonStatusCode = ReasonPhrases.CREATED,
        metadata,
    }: {
        options?: any;
        message: string;
        statusCode?: number;
        reasonStatusCode?: string;
        metadata?: any;
    }) {
        super({ message, statusCode, reasonStatusCode, metadata });
        this.options = options;
    }
}

export { CREATED, OK, SuccessResponse };
