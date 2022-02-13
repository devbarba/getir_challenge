import * as dotenv from 'dotenv-safe';
import { MongoClient } from 'mongodb';
import request from 'supertest';

import app from '../../app';
import { IRecord } from '../../interfaces/records';

describe('POST /orders', () => {
    let connection: MongoClient;

    beforeAll(async () => {
        dotenv.config();
        connection = await MongoClient.connect(app.configObject.app.mongo_uri);
    });

    afterAll(async () => {
        await connection.close();
    });

    const defaultPayload = {
        startDate: '2016-01-26',
        endDate: '2018-02-02',
        minCount: 2700,
        maxCount: 3000,
    };
    const missingKeysPayload = {
        startDate: '2016-01-26',
        maxCount: 3000,
    };

    test('should retrieve data from mongoDB', async () => {
        const records = await request(app.server)
            .post('/records')
            .send(defaultPayload);

        expect(records.body).toBeDefined();
        expect(records.status).toBe(200);
        expect(records.body.records.length).toBeGreaterThan(0);
        expect(records.body).toMatchObject({
            code: 0,
            msg: 'success',
            records: {} as IRecord,
        });
        expect.assertions(4);
    });

    test('should retrieve 404 not found cause does not exist in mongoDB', async () => {
        const newPayload = defaultPayload;
        newPayload.minCount = 2700000;
        newPayload.maxCount = 3000000;

        const records = await request(app.server)
            .post('/records')
            .send(defaultPayload);

        expect(records.body).toBeDefined();
        expect(records.status).toBe(404);
        expect(records.body.records.length).toBe(0);
        expect(records.body).toMatchObject({
            code: 3,
            msg: 'no query results found',
            records: [],
        });
        expect.assertions(4);
    });

    test('should retrieve error because missing keys', async () => {
        const records = await request(app.server)
            .post('/records')
            .send(missingKeysPayload);

        expect(records.body).toBeDefined();
        expect(records.status).toBe(412);
        expect(records.body.records.length).toBe(0);
        expect(records.body).toMatchObject({
            code: 1,
            msg: 'missing field(s): endDate,minCount',
            records: [],
        });
        expect.assertions(4);
    });

    test('should retrieve error because extra keys', async () => {
        const newPayload = defaultPayload;

        const records = await request(app.server)
            .post('/records')
            .send({ ...newPayload, testing: 1000 });

        expect(records.body).toBeDefined();
        expect(records.status).toBe(400);
        expect(records.body.records.length).toBe(0);
        expect(records.body).toMatchObject({
            code: 2,
            msg: 'remove extra field(s): testing',
            records: [],
        });
        expect.assertions(4);
    });

    test('should retrieve error because malformed json', async () => {
        const records = await request(app.server)
            .post('/records')
            .set('Content-Type', 'application/json')
            .send(',,');

        expect(records.body).toBeDefined();
        expect(records.status).toBe(500);
        expect(records.body.records).toBeUndefined();
        expect(records.body).toMatchObject({
            code: 500,
            msg: 'Unexpected token , in JSON at position 0',
        });
        expect.assertions(4);
    });
});
