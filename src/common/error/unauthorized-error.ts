import { AppError } from './app-error';

export class UnAuthorized extends AppError {
    constructor(originalError?: any) {
        super(originalError);
    }
}
