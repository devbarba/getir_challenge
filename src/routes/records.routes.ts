import { Router, Response, Request, NextFunction } from 'express';
import RecordsController from '../controllers/record.controller';

const recordsController = new RecordsController();

const recordsRoutes = Router();

recordsRoutes.post('/', (req: Request, res: Response, next: NextFunction) => {
    recordsController.read({ req, res, next});
});

export default recordsRoutes;
