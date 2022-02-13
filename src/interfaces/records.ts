interface IRecord {
    key: string;
    createdAt: Date;
    totalCount: number;
}

interface IRequestRecord {
    startDate: Date;
    endDate: Date;
    minCount: number;
    maxCount: number;
}

export { IRecord, IRequestRecord };
