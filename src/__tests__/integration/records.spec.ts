import * as dotenv from 'dotenv-safe';
import {
    BAD_REQUEST,
    INTERNAL_SERVER_ERROR,
    NOT_FOUND,
    OK,
    PRECONDITION_FAILED,
} from 'http-status';
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import request from 'supertest';

import app from '../../app';
import { IRecord } from '../../interfaces/records';
import responseCodes from '../../utils/codes';
import { defaultPayload, missingKeysPayload } from '../mocks/payloads.mock';

describe('POST /api/orders', () => {
    let connection: MongoClient;
    const endpoint = '/api/records';

    beforeAll(async () => {
        dotenv.config();
        connection = await MongoClient.connect(app.configObject.app.mongo_uri);
    }, 100000);

    afterAll(async () => {
        await connection.close();
        await mongoose.disconnect();
    });

    test('should retrieve data from mongoDB', async () => {
        const records = await request(app.server)
            .post(endpoint)
            .send(defaultPayload);

        expect(records.body).toBeDefined();
        expect(records.status).toBe(OK);
        expect(records.body.records.length).toBeGreaterThan(0);
        expect(records.body).toMatchObject({
            code: responseCodes.SUCCESS.code,
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
        expect(records.status).toBe(BAD_REQUEST);
        expect(records.body).toMatchObject({
            code: responseCodes.DATA_MISMATCH.code,
            msg: responseCodes.DATA_MISMATCH.extra?.date,
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
        expect(records.status).toBe(BAD_REQUEST);
        expect(records.body).toMatchObject({
            code: responseCodes.DATA_MISMATCH.code,
            msg: responseCodes.DATA_MISMATCH.extra?.count,
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
        expect(records.status).toBe(NOT_FOUND);
        expect(records.body.records.length).toBe(0);
        expect(records.body).toMatchObject({
            code: responseCodes.NOT_FOUND.code,
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
        expect(records.status).toBe(PRECONDITION_FAILED);
        expect(records.body.records.length).toBe(0);
        expect(records.body).toMatchObject({
            code: responseCodes.PRECONDITION_FAILED.code,
            msg: `${responseCodes.PRECONDITION_FAILED.msg}: endDate,minCount`,
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
        expect(records.status).toBe(BAD_REQUEST);
        expect(records.body.records.length).toBe(0);
        expect(records.body).toMatchObject({
            code: responseCodes.BAD_REQUEST.code,
            msg: `${responseCodes.BAD_REQUEST.msg}: testing`,
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
        expect(records.status).toBe(INTERNAL_SERVER_ERROR);
        expect(records.body.records).toBeUndefined();
        expect(records.body).toMatchObject({
            code: responseCodes.SERVER_ERROR.code,
            msg: 'Unexpected token , in JSON at position 0',
        });
        expect.assertions(4);
    });
});
