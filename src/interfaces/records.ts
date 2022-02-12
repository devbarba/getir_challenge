interface IRecord {
    key: string;
    createdAt: Date;
    totalCount: Number;
}

interface IRequestRecord {
    startDate: Date;
    endDate: Date;
    minCount: Number;
    maxCount: Number;
}

export { IRecord, IRequestRecord }
