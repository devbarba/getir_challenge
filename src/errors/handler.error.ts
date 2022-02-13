class Handler extends Error {
    private status_code: number;
    private code: number;
    private errors: unknown[] = [];

    constructor(message: string, code: number, status_code = 400) {
        super('exception');

        this.message = this.extractMessage(message);
        this.code = code;
        this.status_code = status_code;
    }

    setErrors(errors: unknown[]): Handler {
        this.errors = errors;
        return this;
    }

    getErrors(): unknown[] {
        return this.errors;
    }

    getStatusCode(): number {
        return this.status_code;
    }

    getCode(): number {
        return this.code;
    }

    getMessage(): string {
        return this.message;
    }

    private extractMessage(messsage: string): string {
        if (typeof messsage === 'string') {
            return messsage;
        }

        if (typeof messsage === 'object') {
            return Object.values(messsage).join(' ');
        }

        return "message format doesn't supported";
    }
}

export default Handler;
