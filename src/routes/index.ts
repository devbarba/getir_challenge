import { Router } from 'express';

import recordsRoutes from './records.routes';

const routes = Router();

routes.use('/records', recordsRoutes);

export default routes;
