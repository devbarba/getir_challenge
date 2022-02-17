import fs from 'fs';
import Joi from 'joi';
import path from 'path';

import Handler from '../errors/handler.error';
import IConfig from '../interfaces/configs';
import { responseCodes, IResponseCodes } from './codes';

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

const getCodes = (
    code: string
): Pick<IResponseCodes, 'internal' | 'external'> => {
    const givenCodes = {
        'date.base': responseCodes.BAD_REQUEST,
        'any.required': responseCodes.PRECONDITION_FAILED,
        'object.unknown': responseCodes.BAD_REQUEST,
        'date.less': responseCodes.DATA_MISMATCH,
        'number.less': responseCodes.DATA_MISMATCH,
    };

    return givenCodes[code];
};

/**
 * verifyFields: Schema verification with Joi.
 * @param requiredFields string[]
 * @param field {}
 * @returns false | string[]
 */
const verifyFields = (
    body: unknown,
    schema: Joi.ObjectSchema<unknown>
): Handler | void => {
    const schemaValidated = schema.validate(body);

    if (schemaValidated.error && schemaValidated.error.details) {
        const missingField = schemaValidated.error.details[0];
        const finalCodes = getCodes(missingField.type);

        throw new Handler(
            missingField.message.replace(/['"]+/g, ''),
            Number(finalCodes.internal),
            Number(finalCodes.external)
        );
    }
};

export { autoloadConfig, getEnv, getDir, getBaseDir, verifyFields };
