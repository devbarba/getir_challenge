import { Router, Response, Request } from 'express';

const routes = Router();

routes.get('/', (request: Request, response: Response) => {
    return response.json({
        timestamp: Date.now().toString(),
    });
});

export default routes;
