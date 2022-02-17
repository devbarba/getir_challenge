const defaultPayload = {
    startDate: '2016-01-26',
    endDate: '2018-02-02',
    minCount: 2700,
    maxCount: 3000,
};

const missingKeysPayload = {
    startDate: '2016-01-26',
    minCount: 2700,
    maxCount: 3000,
};

const validationResponses = [
    'is not allowed',
    'is required',
    'must be less than ref:',
];

export { defaultPayload, missingKeysPayload, validationResponses };
