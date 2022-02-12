
import { IRecord, IRequestRecord } from '../interfaces/records';
import Record from '../models/Record';

interface IRecordService {
    read({ startDate, endDate, minCount, maxCount }: IRequestRecord): Promise<IRecord[]>;
}

class RecordService implements IRecordService {
    public async read({
        startDate,
        endDate,
        minCount,
        maxCount
    }: IRequestRecord): Promise<IRecord[]> {
        const record: IRecord[] = await Record.aggregate([
            { $match: { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
            { $addFields: { totalCount: { $sum: "$counts" } } },
            { $match: { totalCount: { $gte: minCount, $lte: maxCount } } },
            { $project: { _id: 0, key: 1, createdAt: 1, totalCount: 1 } }
        ]);

        return record;
  }
}

export default RecordService;
