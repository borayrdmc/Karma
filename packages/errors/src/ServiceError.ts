export class ServiceError extends Error{

    statusCode: number;
    constructor(message:string, statusCode:number, options?:ErrorOptions) {
        super(message, options);
        this.statusCode = statusCode;
    }
}
