import { Router, Response, Request } from 'express';
import { OK } from 'http-status';

import recordsRoutes from './records.routes';

const routes = Router();

routes.get('/', (req: Request, res: Response) =>
    res.status(OK).json({ timestamp: Date.now().toString() })
);

routes.use('/records', recordsRoutes);

export default routes;
