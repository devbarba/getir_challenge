import * as dotenv from 'dotenv-safe';
import Joi from 'joi';

import IConfig from '../../configs/app';
import {
    autoloadConfig,
    getEnv,
    getDir,
    getBaseDir,
    verifyFields,
} from '../../utils/helper';
import {
    defaultPayload,
    missingKeysPayload,
    validationResponses,
} from '../mocks/payloads.mock';

describe('Testing helper functions', () => {
    beforeAll(() => {
        dotenv.config();
    });

    describe('handling getDir()', () => {
        test('expect return dir with getDir()', () => {
            expect(getDir('/')).toBe('/');
            expect.assertions(1);
        });
    });

    describe('handling getBaseDir()', () => {
        test('expect return dir with getBaseDir()', () => {
            expect(getBaseDir('/')).toBe('/');
            expect.assertions(1);
        });

        test('expect return base dir using getDir() and getBaseDir()', () => {
            expect(getBaseDir(getDir())).toBe(getBaseDir(getDir()));
            expect.assertions(1);
        });
    });

    describe('handling getEnv()', () => {
        test('expect return APP_ENV value', () => {
            expect(getEnv('APP_ENV', 'local')).toBe('local');
            expect.assertions(1);
        });

        test('expect return APP_ENV value = "local" because alternative APP_ENV1 does not exists', () => {
            expect(getEnv('APP_ENV1', 'APP_ENV')).toBe('local');
            expect.assertions(1);
        });

        test('expect return alternate NON_EXISTENT value', () => {
            expect(getEnv('NON_EXISTENT', 'alternate_non_existent')).toBe(
                'alternate_non_existent'
            );
            expect.assertions(1);
        });

        test('expect return missing env: MONGO_TEST', () => {
            expect(() => getEnv('MONGO_TEST', '', true)).toThrow(
                'missing key: MONGO_TEST'
            );
            expect.assertions(1);
        });
    });

    describe('handling autoloadConfig()', () => {
        test('expect load all envs with autoloadConfig()', () => {
            expect(autoloadConfig(getBaseDir())).toMatchObject(
                {} as typeof IConfig
            );
            expect.assertions(1);
        });

        test('expect throw error whentry to load envs with autoloadConfig()', () => {
            expect(() => autoloadConfig(getBaseDir('/non-existent'))).toThrow(
                'directory config not exists'
            );
            expect.assertions(1);
        });
    });

    describe('handling verifyFields()', () => {
        const joiSchema = Joi.object({
            startDate: Joi.date().less(Joi.ref('endDate')).required(),
            endDate: Joi.date().required(),
            minCount: Joi.number().less(Joi.ref('maxCount')).required(),
            maxCount: Joi.number().required(),
        });

        test('expect to return missing fields when call verifyFields()', () => {
            expect(() =>
                verifyFields(missingKeysPayload, joiSchema)
            ).toThrowError(`endDate ${validationResponses[1]}`);
            expect.assertions(1);
        });

        test('expect to return extra fields when call verifyFields()', () => {
            expect(() =>
                verifyFields({ ...defaultPayload, testing: true }, joiSchema)
            ).toThrowError(`testing ${validationResponses[0]}`);
            expect.assertions(1);
        });

        test('expect to return void when call verifyFields()', () => {
            expect(verifyFields(defaultPayload, joiSchema)).toBeFalsy();
            expect.assertions(1);
        });

        test('expect to return validation error when call verifyFields() cause invalid date format: startDate', () => {
            expect(() =>
                verifyFields({ ...defaultPayload, startDate: 'abc' }, joiSchema)
            ).toThrowError(`startDate ${validationResponses[3]}`);
            expect.assertions(1);
        });

        test('expect to return validation error when call verifyFields() cause invalid date format: endDate', () => {
            expect(() =>
                verifyFields({ ...defaultPayload, endDate: 'abc' }, joiSchema)
            ).toThrowError(`endDate ${validationResponses[3]}`);
            expect.assertions(1);
        });

        test('expect to return validation error when call verifyFields() cause endDate < startDate', () => {
            expect(() =>
                verifyFields(
                    {
                        ...defaultPayload,
                        startDate: '20222-01-01',
                        endDate: '2011-10-10',
                    },
                    joiSchema
                )
            ).toThrowError(`startDate ${validationResponses[2]}endDate`);
            expect.assertions(1);
        });

        test('expect to return validation error when call verifyFields() cause invalid number format: minCount', () => {
            expect(() =>
                verifyFields({ ...defaultPayload, minCount: 'abc' }, joiSchema)
            ).toThrowError(`minCount ${validationResponses[4]}`);
            expect.assertions(1);
        });

        test('expect to return validation error when call verifyFields() cause invalid number format: maxCount', () => {
            expect(() =>
                verifyFields({ ...defaultPayload, maxCount: 'abc' }, joiSchema)
            ).toThrowError(`maxCount ${validationResponses[4]}`);
            expect.assertions(1);
        });
    });
});
