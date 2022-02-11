import mongoose, { mongo } from 'mongoose';
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
        this.loadMongoDatabase();
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

    public loadMongoDatabase() {
        const mongoUri = this.configObject.app.mongo_uri;

        if (mongoUri) {
            mongoose.connect(mongoUri)
                .then(() => {
                    return console.log(`Successfully connected to ${mongoUri}`);
                })
                .catch((error: Error) => {
                    console.log('Error connecting to database: ', error);
                    return process.exit(1);
                });
        } else {
            throw 'Error connecting to database: MONGO_URI not found.';
        }
    }
}

export default new App();
