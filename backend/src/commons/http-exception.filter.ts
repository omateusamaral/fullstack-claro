import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

type HttpErrorResponse = {
    message?: string | string[];
    error?: string;
    [key: string]: unknown;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const isHttpException = exception instanceof HttpException;
        const status = isHttpException ? exception.getStatus() : 500;
        const errorResponse: any = isHttpException
            ? exception.getResponse()
            : undefined;
        const errorMessage = this.getMessage(exception, errorResponse);
        const logMessage = Array.isArray(errorMessage)
            ? errorMessage.join(', ')
            : errorMessage;

        this.logger.error(
            `${request.method} ${request.originalUrl} - ${status} - ${logMessage}`,
            exception instanceof Error ? exception.stack : undefined,
        );

        response.status(status).json({
            error: {
                code: status,
                message: isHttpException ? errorResponse.error : undefined,
                details: errorMessage,
            },
        });
    }

    private getMessage(
        exception: unknown,
        errorResponse: string | object | undefined,
    ): string | string[] {
        if (typeof errorResponse === 'string') {
            return errorResponse;
        }

        const payload = this.isHttpErrorResponse(errorResponse);
        if (payload?.message) {
            return payload.message;
        }

        if (exception instanceof Error) {
            return exception.message;
        }

        return 'Internal server error';
    }

    private isHttpErrorResponse(
        response: string | object | undefined,
    ): HttpErrorResponse | undefined {
        return response !== null &&
            typeof response === 'object' &&
            !Array.isArray(response)
            ? (response as HttpErrorResponse)
            : undefined;
    }
}
