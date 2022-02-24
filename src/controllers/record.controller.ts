import { Response } from 'express';

import { IRoute, IRouteResponse } from '../interfaces/route';
import RecordService from '../services/record.service';
import { responseCodes } from '../utils/codes';

interface IRecordController {
    read({ req, res, next }: IRoute): Promise<Response<IRouteResponse>>;
}

class Recordontroller implements IRecordController {
    private recordService: RecordService;

    constructor() {
        this.recordService = new RecordService();
    }

    public async read({
        req,
        res,
        next,
    }: IRoute): Promise<Response<IRouteResponse>> {
        try {
            const { startDate, endDate, minCount, maxCount } = req.body;

            const records = await this.recordService.read({
                startDate,
                endDate,
                minCount,
                maxCount,
            });

            return res.status(responseCodes.SUCCESS.external).json({
                code: responseCodes.SUCCESS.internal,
                msg: responseCodes.SUCCESS.msg,
                records,
            });
        } catch (error) {
            return next(error);
        }
    }
}

export default Recordontroller;
