interface IResponseCodes {
    [key: string]: {
        code: number;
        msg: string;
        extra?: { date: string; count: string };
    };
}

const responseCodes: IResponseCodes = {
    SUCCESS: {
        code: 0,
        msg: 'success',
    },
    PRECONDITION_FAILED: {
        code: 1,
        msg: 'missing field(s)',
    },
    BAD_REQUEST: {
        code: 2,
        msg: 'remove extra field(s)',
    },
    NOT_FOUND: {
        code: 3,
        msg: 'no query results found',
    },
    DATA_MISMATCH: {
        code: 4,
        msg: '',
        extra: {
            date: 'startDate greather than endDate',
            count: 'minCount greather than maxCount',
        },
    },
    SERVER_ERROR: {
        code: 5,
        msg: 'internal server error',
    },
};

export default responseCodes;
