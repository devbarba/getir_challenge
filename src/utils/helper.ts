import fs from 'fs';
import { BAD_REQUEST, PRECONDITION_FAILED } from 'http-status';
import path from 'path';

import Handler from '../errors/handler.error';
import IConfig from '../interfaces/configs';
import responseCodes from './codes';

/**
 * autoloadConfig: Auto load configurations.
 * @param base_dir
 * @returns
 */
const autoloadConfig = (base_dir: string): IConfig => {
    const configDir = path.join(base_dir, 'configs');

    if (!fs.existsSync(configDir)) throw 'directory config not exists';

    const configs = fs.readdirSync(configDir);

    const data: any = {};

    configs.forEach((file) => {
        const filename = path.join(configDir, file);
        data[file.split('.')[0]] = require(filename).default;
    });

    return data;
};

/**
 * getEnv: Get passed env.
 * @param key
 * @param alternate
 * @returns
 */
const getEnv = (
    key: string,
    alternate: any,
    required?: boolean
): string | undefined => {
    if (
        required &&
        process.env[key] === undefined &&
        process.env[alternate] === undefined
    )
        throw `missing key: ${key}`;

    if (process.env[key] && process.env[key] !== 'null')
        return process.env[key];

    if (process.env[alternate] && process.env[alternate] !== 'null')
        return process.env[alternate];

    return alternate;
};

/**
 * getDir: Get passed dir.
 * @param folder
 * @returns string
 */
const getDir = (folder = ''): string => path.resolve(__dirname, '../', folder);

/**
 * baseDir: Get the base dir.
 * @param folder
 * @returns string
 */
const getBaseDir = (folder = ''): string => getDir(folder ? `${folder}` : '');

/**
 * verifyFields: Verify if required field is present or if have extra fields.
 * @param requiredFields string[]
 * @param field {}
 * @returns false | string[]
 */
const verifyFields = (
    requiredFields: string[],
    fields: Record<string, unknown>
): false | string[] => {
    const inexistentFields: string[] = [];
    const extraFields: string[] = [];

    requiredFields.forEach((reqField) => {
        if (!(reqField in fields)) inexistentFields.push(reqField);
    });

    if (inexistentFields.length > 0)
        throw new Handler(
            `${responseCodes.PRECONDITION_FAILED.msg}: ${inexistentFields}`,
            responseCodes.PRECONDITION_FAILED.code,
            PRECONDITION_FAILED
        );

    for (const field in fields)
        if (!requiredFields.includes(field)) extraFields.push(field);

    if (extraFields.length > 0)
        throw new Handler(
            `${responseCodes.BAD_REQUEST.msg}: ${extraFields}`,
            responseCodes.BAD_REQUEST.code,
            BAD_REQUEST
        );

    return false;
};

export { autoloadConfig, getEnv, getDir, getBaseDir, verifyFields };
