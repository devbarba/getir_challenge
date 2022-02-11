

import { Document, Model, model, Schema, ObjectId } from 'mongoose';

interface RecordInterface extends Document {
    _id: ObjectId;
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

const RecordModel: Model<RecordInterface> = model<
    RecordInterface,
    Model<RecordInterface>
>('Record', Record);

export default RecordModel;
