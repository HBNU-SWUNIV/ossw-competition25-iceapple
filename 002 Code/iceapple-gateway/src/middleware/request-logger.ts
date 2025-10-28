import { randomBytes } from 'node:crypto';
import type { RequestHandler } from 'express';

export const requestLogger: RequestHandler = (req, res, next) => {
    const id = randomBytes(4).toString('hex');
    const { method, originalUrl } = req;
    console.log(
        `${new Date().toISOString()} | REQUEST  | ${id} | ${method} ${originalUrl}`,
    );

    res.on('finish', () => {
        const { statusCode } = res;
        console.log(
            `${new Date().toISOString()} | RESPONSE | ${id} | ${method} ${originalUrl} | ${statusCode}`,
        );
    });

    next();
};
