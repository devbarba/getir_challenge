import mongoose from 'mongoose';

export default (db: string, start: boolean) => {
    if (start) {
        mongoose
            .connect(db, {
                useCreateIndex: true,
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .catch(() => process.exit(1));
    }
};
