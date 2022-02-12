import mongoose from 'mongoose';

export default (db: string, start: boolean) => {
    if (start) {
        mongoose
            .connect(db, {
                useCreateIndex: true,
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .catch((error: Error) => process.exit(1));
    }
};
