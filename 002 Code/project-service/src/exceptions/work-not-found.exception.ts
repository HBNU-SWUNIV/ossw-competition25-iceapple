import { HttpStatus } from '@nestjs/common';

import { ServiceException } from './service-exception';

export class WorkNotFoundException extends ServiceException {
    constructor(id: string) {
        super(HttpStatus.NOT_FOUND, 'Work Not Found', `${id} is Not Exists`);
    }
}
