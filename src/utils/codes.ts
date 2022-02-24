import {
    BAD_REQUEST,
    NOT_FOUND,
    OK,
    PRECONDITION_FAILED,
    INTERNAL_SERVER_ERROR,
} from 'http-status';

interface IResponseCodes {
    [key: string]: {
        internal: number;
        external: number;
        msg?: string;
    };
}

const responseCodes: IResponseCodes = {
    SUCCESS: {
        internal: 0,
        external: OK,
        msg: 'success',
    },
    PRECONDITION_FAILED: {
        internal: 1,
        external: PRECONDITION_FAILED,
    },
    BAD_REQUEST: {
        internal: 2,
        external: BAD_REQUEST,
    },
    NOT_FOUND: {
        internal: 3,
        external: NOT_FOUND,
        msg: 'no query results found',
    },
    DATA_MISMATCH: {
        internal: 4,
        external: BAD_REQUEST,
    },
    SERVER_ERROR: {
        internal: 5,
        external: INTERNAL_SERVER_ERROR,
    },
};

export { responseCodes, IResponseCodes };
