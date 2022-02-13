import { NOT_FOUND } from 'http-status';

import Handler from '../errors/handler.error';
import { IRecord, IRequestRecord } from '../interfaces/records';
import Record from '../models/Record';

interface IRecordService {
    read({
        startDate,
        endDate,
        minCount,
        maxCount,
    }: IRequestRecord): Promise<IRecord[]>;
}

class RecordService implements IRecordService {
    public async read({
        startDate,
        endDate,
        minCount,
        maxCount,
    }: IRequestRecord): Promise<IRecord[]> {
        const records: IRecord[] = await Record.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate),
                    },
                },
            },
            { $addFields: { totalCount: { $sum: '$counts' } } },
            { $match: { totalCount: { $gte: minCount, $lte: maxCount } } },
            { $project: { _id: 0, key: 1, createdAt: 1, totalCount: 1 } },
        ]);

        if (!records || records.length === 0)
            throw new Handler('no query results found', 3, NOT_FOUND);

        return records;
    }
}

export default RecordService;
