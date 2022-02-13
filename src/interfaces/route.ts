import { Request, Response } from 'express';

import { IRecord } from './records';

interface IRoute {
    req: Request;
    res: Response;
    next: CallableFunction;
}

interface IRouteResponse {
    code: number;
    msg: string;
    records?: IRecord[];
}

export { IRoute, IRouteResponse };
