import { AppError } from './app-error';

export class NotFoundError extends AppError {
    constructor(originalError?: any) {
        super(originalError);
    }
}
