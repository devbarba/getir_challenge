import * as dotenv from 'dotenv-safe';
import { MongoClient } from 'mongodb';

import app from '../../app';
import RecordService from '../../services/record.service';

describe('Testing RecordsService', () => {
    let recordService: RecordService;
    let connection: MongoClient;

    beforeAll(async () => {
        dotenv.config();
        recordService = new RecordService();
        connection = await MongoClient.connect(app.configObject.app.mongo_uri);
    }, 10000);

    afterAll(async () => {
        await connection.close();
    });

    const defaultPayload = {
        startDate: '2016-01-26',
        endDate: '2018-02-02',
        minCount: 2700,
        maxCount: 3000,
    };

    test('should retrieve data from mongoDB', async () => {
        const records = await recordService.read({
            startDate: new Date(defaultPayload.startDate),
            endDate: new Date(defaultPayload.endDate),
            minCount: defaultPayload.minCount,
            maxCount: defaultPayload.maxCount,
        });

        expect(records).toBeDefined();
        expect(records.length).toBeGreaterThan(0);
        expect(records).toMatchObject(
            {} as {
                key: string;
                createdAt: string;
                totalCount: number;
            }[]
        );
        expect.assertions(3);
    });

    test('should retrieve a empty [] from mongoDB', async () => {
        await expect(() =>
            recordService.read({
                startDate: new Date(defaultPayload.startDate),
                endDate: new Date(defaultPayload.endDate),
                minCount: 27000,
                maxCount: 30000,
            })
        ).rejects.toThrow('no query results found');
        expect.assertions(1);
    });
});
