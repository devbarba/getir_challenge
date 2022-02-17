import { Router, Response, Request, NextFunction } from 'express';
import Joi from 'joi';

import RecordsController from '../controllers/record.controller';
import { verifyFields } from '../utils/helper';

const recordsController = new RecordsController();

const recordsRoutes = Router();

recordsRoutes.post('/', (req: Request, res: Response, next: NextFunction) => {
    verifyFields(
        req.body,
        Joi.object({
            startDate: Joi.date().less(Joi.ref('endDate')).required(),
            endDate: Joi.date().required(),
            minCount: Joi.number().less(Joi.ref('maxCount')).required(),
            maxCount: Joi.number().required(),
        })
    );

    recordsController.read({ req, res, next });
});

export default recordsRoutes;
