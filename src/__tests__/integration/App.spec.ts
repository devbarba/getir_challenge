import request from 'supertest';
import app from '../../app';

describe('Testing app start', () => {
    test('Call to endpoint "/" with no errors', async () => {
        expect.assertions(2);
        const response = await request(app.server).get('/');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('timestamp');
    });

    test('Should allow cors', async () => {
        expect.assertions(1);
        const response = await request(app.server).options('/');
        expect(response.header['access-control-allow-origin']).toBe('*');
    });
});
