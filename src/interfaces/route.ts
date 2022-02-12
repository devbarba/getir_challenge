import { Request, Response } from 'express';
import { IRecord } from './records';

interface IRoute {
    req: Request;
    res: Response;
    next: CallableFunction;
}

interface IRouteResponse {
    code: Number;
    msg: String;
    records?: IRecord[]
}

export { IRoute, IRouteResponse }
