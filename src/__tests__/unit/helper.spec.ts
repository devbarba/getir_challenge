import IConfig from '../../configs/app';
import {
    autoloadConfig,
    getEnv,
    getDir,
    getBaseDir
} from '../../utils/helper';

describe('Testing helper functions', () => {
    test('expect return dir with getDir()', () => {
        expect(getDir('/')).toBe('/');
        expect.assertions(1);
    });

    test('expect return dir with getBaseDir()', () => {
        expect(getBaseDir('/')).toBe('/');
        expect.assertions(1);
    });

    test('expect return base dir using getDir() and getBaseDir()', () => {
        expect(getBaseDir(getDir())).toBe(getBaseDir(getDir()));
        expect.assertions(1);
    });

    test('expect return APP_ENV value', () => {
        expect(getEnv('APP_ENV', 'local')).toBe('local');
        expect.assertions(1);
    });

    test('expect return alternate NON_EXISTENT value', () => {
        expect(getEnv('NON_EXISTENT', 'alternate_non_existent')).toBe('alternate_non_existent');
        expect.assertions(1);
    });

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
