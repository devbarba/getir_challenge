import bodyParser from 'body-parser';
import express, { Application } from 'express';
import cors from 'cors';
import routes from './routes/index';
import IConfig from './interfaces/configs';
import { autoloadConfig, getBaseDir } from './utils/helper';

class App {
    public server: Application;
    public configObject: IConfig;

    constructor() {
        this.loadConfigurations();
        this.server = express();
        this.middlewares();
        this.routes();
    }

    public loadConfigurations() {
        this.configObject = autoloadConfig(getBaseDir());
    }

    public middlewares() {
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
}

export default new App();
