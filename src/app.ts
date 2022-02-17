import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Application } from 'express';

import connect from './database';
import Handler from './errors/handler.error';
import IConfig from './interfaces/configs';
import routes from './routes/index';
import { responseCodes } from './utils/codes';
import { autoloadConfig, getBaseDir } from './utils/helper';

class App {
    public server: Application;
    public configObject: IConfig;

    constructor() {
        this.loadConfigurations();
        this.server = express();
        this.middlewares();
        this.routes();
        this.mongoDatabase();
        this.errorHandling();
    }

    private loadConfigurations() {
        this.configObject = autoloadConfig(getBaseDir());
    }

    private middlewares() {
        this.server.use(cors());
        this.server.use(bodyParser.json());
        this.server.use(
            bodyParser.urlencoded({
                extended: true,
            })
        );
    }

    private routes() {
        this.server.use('/api', routes);
    }

    private mongoDatabase() {
        connect(this.configObject.app.mongo, true);
    }

    private errorHandling() {
        this.server.use((error, req, res, next) => {
            if (error instanceof Handler) {
                return res.status(error.getStatusCode()).json({
                    code: error.getCode(),
                    msg: error.getMessage(),
                    records: [],
                });
            }

            return res.status(500).json({
                code: responseCodes.SERVER_ERROR.internal,
                msg: error.message,
            });
        });
    }
}

export default new App();
