import * as dotenv from 'dotenv-safe';
import { NO_CONTENT, OK } from 'http-status';
import mongoose from 'mongoose';
import request from 'supertest';

import app from '../../app';

describe('GET `/`', () => {
    const endpoint = '/api';

    beforeAll(async () => {
        dotenv.config();
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    test('This should load with no errors', async () => {
        expect.assertions(2);
        const response = await request(app.server).get(endpoint);
        expect(response.status).toBe(OK);
        expect(response.body.timestamp).toBeDefined();
    });

    test('This should allow cors', async () => {
        expect.assertions(2);
        const response = await request(app.server).options(endpoint);
        expect(response.status).toBe(NO_CONTENT);
        expect(response.header['access-control-allow-origin']).toBe('*');
    });
});
