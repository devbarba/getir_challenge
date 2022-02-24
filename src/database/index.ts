import mongoose from 'mongoose';

import IConfig from '../interfaces/configs';

export default (db: IConfig['app']['mongo'], start: boolean) => {
    if (start) {
        mongoose
            .connect(`mongodb+srv://${db.host}`, {
                dbName: db.name,
                user: db.user,
                pass: db.pass,
                useCreateIndex: true,
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .catch(() => process.exit(1));
    }
};
