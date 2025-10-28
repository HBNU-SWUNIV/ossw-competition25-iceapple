import { Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

const requestLogger = new Logger(requestLogMiddleware.name);

export function requestLogMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    requestLogger.log(`new Request [${req.method}] ${req.originalUrl}`);
    next();
}
