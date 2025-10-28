import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnsupportedMediaTypeException,
} from '@nestjs/common';

@Injectable()
export class FormDataOnlyGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const contentType = request.headers['content-type'];

        if (!contentType || !contentType.includes('multipart/form-data')) {
            throw new UnsupportedMediaTypeException(
                "Content-Type must be 'multipart/form-data'",
            );
        }

        return true;
    }
}
