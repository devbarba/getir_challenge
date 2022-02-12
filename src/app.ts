import connect from './database';
import bodyParser from 'body-parser';
import express, { Application } from 'express';
import cors from 'cors';
import routes from './routes/index';
import IConfig from './interfaces/configs';
import { autoloadConfig, getBaseDir } from './utils/helper';
import Handler from './errors/handler.error';

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
        this.server.use(routes);
    }

    private mongoDatabase() {
        connect(this.configObject.app.mongo_uri, true);
    }

    private errorHandling() {
        this.server.use((error, req, res, next) => {
            if (error instanceof Handler) {
                return res.status(error.getStatusCode()).json({
                    code: error.getCode(),
                    msg: error.getMessage(),
                    records: []
                })
            }

            return res.status(500).json({
                code: 500,
                msg:  error.message
            })
        });
    }
}

export default new App();
