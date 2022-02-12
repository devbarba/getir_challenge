import { IRoute, IRouteResponse } from '../interfaces/route';
import { Response } from 'express';
import { verifyFields } from '../utils/helper';
import { OK } from 'http-status';
import RecordService from '../services/record.service';

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
            verifyFields(['startDate', 'endDate', 'minCount', 'maxCount'], req.body);

            const { startDate, endDate, minCount, maxCount } = req.body;

            const records = await this.recordService.read({
                startDate,
                endDate,
                minCount,
                maxCount
            });

            return res.status(OK).json({ code: 0, msg: 'success', records });
        } catch (error) {
            return next(error);
        }
    }
}

export default Recordontroller;
