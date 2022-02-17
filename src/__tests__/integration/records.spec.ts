import * as dotenv from 'dotenv-safe';
import mongoose from 'mongoose';
import request from 'supertest';

import app from '../../app';
import { IRecord } from '../../interfaces/records';
import { responseCodes } from '../../utils/codes';
import {
    defaultPayload,
    missingKeysPayload,
    validationResponses,
} from '../mocks/payloads.mock';

describe('POST /api/orders', () => {
    const endpoint = '/api/records';

    beforeAll(async () => {
        dotenv.config();
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    test('should retrieve data from mongoDB', async () => {
        const records = await request(app.server)
            .post(endpoint)
            .send(defaultPayload);

        expect(records.body).toBeDefined();
        expect(records.status).toBe(responseCodes.SUCCESS.external);
        expect(records.body.records.length).toBeGreaterThan(0);
        expect(records.body).toMatchObject({
            code: responseCodes.SUCCESS.internal,
            msg: responseCodes.SUCCESS.msg,
            records: {} as IRecord,
        });
        expect.assertions(4);
    });

    test('should return precondition failed error cause startDate > endDate', async () => {
        const records = await request(app.server)
            .post(endpoint)
            .set('Content-Type', 'application/json')
            .send({
                startDate: defaultPayload.endDate,
                endDate: defaultPayload.startDate,
                minCount: defaultPayload.minCount,
                maxCount: defaultPayload.maxCount,
            });

        expect(records.body).toBeDefined();
        expect(records.status).toBe(responseCodes.DATA_MISMATCH.external);
        expect(records.body).toMatchObject({
            code: responseCodes.DATA_MISMATCH.internal,
            msg: `startDate ${validationResponses[2]}endDate`,
            records: [],
        });
        expect.assertions(3);
    });

    test('should return precondition failed error cause minCount > maxCount', async () => {
        const records = await request(app.server)
            .post(endpoint)
            .set('Content-Type', 'application/json')
            .send({
                startDate: defaultPayload.startDate,
                endDate: defaultPayload.endDate,
                minCount: defaultPayload.maxCount,
                maxCount: defaultPayload.minCount,
            });

        expect(records.body).toBeDefined();
        expect(records.status).toBe(responseCodes.DATA_MISMATCH.external);
        expect(records.body).toMatchObject({
            code: responseCodes.DATA_MISMATCH.internal,
            msg: `minCount ${validationResponses[2]}maxCount`,
            records: [],
        });
        expect.assertions(3);
    });

    test('should retrieve 404 not found cause does not exist in mongoDB', async () => {
        const newPayload = defaultPayload;
        newPayload.minCount = 2700000;
        newPayload.maxCount = 3000000;

        const records = await request(app.server)
            .post(endpoint)
            .send(defaultPayload);

        expect(records.body).toBeDefined();
        expect(records.status).toBe(responseCodes.NOT_FOUND.external);
        expect(records.body.records.length).toBe(0);
        expect(records.body).toMatchObject({
            code: responseCodes.NOT_FOUND.internal,
            msg: responseCodes.NOT_FOUND.msg,
            records: [],
        });
        expect.assertions(4);
    });

    test('should retrieve error because missing keys', async () => {
        const records = await request(app.server)
            .post(endpoint)
            .send(missingKeysPayload);

        expect(records.body).toBeDefined();
        expect(records.status).toBe(responseCodes.PRECONDITION_FAILED.external);
        expect(records.body.records.length).toBe(0);
        expect(records.body).toMatchObject({
            code: responseCodes.PRECONDITION_FAILED.internal,
            msg: `endDate ${validationResponses[1]}`,
            records: [],
        });
        expect.assertions(4);
    });

    test('should retrieve error because extra keys', async () => {
        const newPayload = defaultPayload;

        const records = await request(app.server)
            .post(endpoint)
            .send({ ...newPayload, testing: 1000 });

        expect(records.body).toBeDefined();
        expect(records.status).toBe(responseCodes.BAD_REQUEST.external);
        expect(records.body.records.length).toBe(0);
        expect(records.body).toMatchObject({
            code: responseCodes.BAD_REQUEST.internal,
            msg: `testing ${validationResponses[0]}`,
            records: [],
        });
        expect.assertions(4);
    });

    test('should retrieve error because malformed json', async () => {
        const records = await request(app.server)
            .post(endpoint)
            .set('Content-Type', 'application/json')
            .send(',,');

        expect(records.body).toBeDefined();
        expect(records.status).toBe(responseCodes.SERVER_ERROR.external);
        expect(records.body.records).toBeUndefined();
        expect(records.body).toMatchObject({
            code: responseCodes.SERVER_ERROR.internal,
            msg: 'Unexpected token , in JSON at position 0',
        });
        expect.assertions(4);
    });
});
