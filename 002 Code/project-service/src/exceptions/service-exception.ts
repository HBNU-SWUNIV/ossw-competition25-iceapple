import { HttpException, HttpStatus } from '@nestjs/common';

export class ServiceException extends HttpException {
    constructor(
        status: HttpStatus,
        error: string,
        public message: string,
    ) {
        super(
            {
                error,
                message,
            },
            status,
        );
    }
}
