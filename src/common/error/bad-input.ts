import { AppError } from './app-error';

export class BadInput extends AppError {
    constructor(originalError?: any) {
        super(originalError);
    }
}
