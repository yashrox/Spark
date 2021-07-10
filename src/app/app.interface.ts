import * as express from 'express';



export namespace App {
    export interface User {
        id: string;
        session: string;
    }
    export interface Request<T = any> extends express.Request {
        user?: User;
    }
    export interface Response extends express.Response {
    }
    export interface NextFunction extends express.NextFunction {
        
    }
}

