export class ServiceError extends Error{

    statusCode:number;
    isFatal:boolean;

    constructor(
        message:string,
        statusCode:number,
        isFatal:boolean = (statusCode === 400),
        options?:ErrorOptions
    ){
        super(message,options);
        this.statusCode=statusCode;
        this.isFatal=isFatal;
    }
}