import { IRoute, IRouteResponse } from '../interfaces/route';
import Record from 'src/models/Record';
import { Response } from 'express';
import { verifyRequiredFields } from 'src/utils/helper';
import httpStatus from 'http-status';
import RecordService from 'src/services/record.service';

interface IRecordController {
    read({
      req, res, next,
    }: IRoute): Promise<Response<IRouteResponse>>;
}

class Recordontroller implements IRecordController {
    private recordService: RecordService;

    constructor() {
        this.recordService = new RecordService();
    }

    public async read({
        req, res, next,
    }: IRoute): Promise<Response<IRouteResponse>> {
        try {
            const requiredFields = ['startDate', 'endDate', 'minCount', 'maxCount'];
            const fields = verifyRequiredFields(requiredFields, req.body);

            if (fields) return res
                .status(httpStatus.PRECONDITION_FAILED)
                .json({
                    code: 1,
                    message: `Missing fields: ${fields}`
            });

            const { startDate, endDate, minCount, maxCount } = req.body;

            const records = await this.recordService.read({
                startDate,
                endDate,
                minCount,
                maxCount
            });

            return res.status(httpStatus.OK).json({
                code: 0,
                msg: 'success',
                records
            });
        } catch (error) {
            return next(error);
        }
    }
}

export default Recordontroller;
