import * as dotenv from 'dotenv-safe';
import IConfig from '../../configs/app';
import {
    autoloadConfig,
    getEnv,
    getDir,
    getBaseDir,
    verifyFields
} from '../../utils/helper';

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
            expect(getEnv('NON_EXISTENT', 'alternate_non_existent')).toBe('alternate_non_existent');
            expect.assertions(1);
        });
    });

    describe('handling autoloadConfig()', () => {
        test('expect load all envs with autoloadConfig()', () => {
            expect(autoloadConfig(getBaseDir())).toMatchObject({} as typeof IConfig)
            expect.assertions(1);
        });

        test('expect throw error whentry to load envs with autoloadConfig()', () => {
            expect(() => autoloadConfig(getBaseDir('/non-existent')))
                .toThrow('directory config not exists');
            expect.assertions(1);
        });
    });

    describe('handling verifyFields()', () => {
        const requiredFields = ['startDate', 'endDate', 'minCount', 'maxCount'];
        const missingBody = { startDate: '2022-02-10', minCount: 3000 };
        let fullBody = {
            startDate: '2022-02-10',
            endDate: '2022-02-12',
            minCount: 3000,
            maxCount: 3100
        };

        test('expect to return missing fields when call verifyFields()', () => {
            expect(() => verifyFields(requiredFields, missingBody))
                .toThrowError('missing field(s): endDate,maxCount');
            expect.assertions(1);
        });

        test('expect to return extra fields when call verifyFields()', () => {
            fullBody['testing'] = true;
            expect(() => verifyFields(requiredFields, fullBody))
                .toThrowError('remove extra field(s): testing');
            expect.assertions(1);
        });

        test('expect to return false when call verifyFields()', () => {
            delete fullBody['testing'];
            const fields = verifyFields(requiredFields, fullBody);

            expect(fields).toBeFalsy();
            expect.assertions(1);
        });
    });
});
