import { Document, Model, model, Schema } from 'mongoose';

interface IRecordInterface extends Document {
    key: string;
    value: string;
    counts: string;
    createdAt: string;
}

const Record = new Schema({
    key: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        unique: true,
        required: true,
    },
    counts: {
        type: [String],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const RecordModel: Model<IRecordInterface> = model<
    IRecordInterface,
    Model<IRecordInterface>
>('Record', Record);

export default RecordModel;
