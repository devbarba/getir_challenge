import { Response } from 'express';
import { BAD_REQUEST, OK } from 'http-status';

import Handler from '../errors/handler.error';
import { IRoute, IRouteResponse } from '../interfaces/route';
import RecordService from '../services/record.service';
import responseCodes from '../utils/codes';
import { verifyFields } from '../utils/helper';

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
            verifyFields(
                ['startDate', 'endDate', 'minCount', 'maxCount'],
                req.body
            );

            const { startDate, endDate, minCount, maxCount } = req.body;

            if (new Date(startDate).getTime() > new Date(endDate).getTime())
                throw new Handler(
                    // @ts-ignore
                    responseCodes.DATA_MISMATCH.extra.date,
                    responseCodes.DATA_MISMATCH.code,
                    BAD_REQUEST
                );

            if (minCount > maxCount)
                throw new Handler(
                    // @ts-ignore
                    responseCodes.DATA_MISMATCH.extra.count,
                    responseCodes.DATA_MISMATCH.code,
                    BAD_REQUEST
                );

            const records = await this.recordService.read({
                startDate,
                endDate,
                minCount,
                maxCount,
            });

            return res.status(OK).json({
                code: responseCodes.SUCCESS.code,
                msg: responseCodes.SUCCESS.msg,
                records,
            });
        } catch (error) {
            return next(error);
        }
    }
}

export default Recordontroller;
