import fs from 'fs';
import { BAD_REQUEST, PRECONDITION_FAILED} from 'http-status';
import path from 'path';
import Handler from '../errors/handler.error';
import IConfig from '../interfaces/configs';

/**
 * autoloadConfig: Auto load configurations.
 * @param base_dir
 * @returns
 */
const autoloadConfig = (base_dir: string) : IConfig => {
    const configDir = path.join(base_dir, 'configs');

    if (!fs.existsSync(configDir)) {
      // eslint-disable-next-line no-throw-literal
      throw 'directory config not exists';
    }

    const configs = fs.readdirSync(configDir);

    const data : any = {};

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
const getEnv = (key: string, alternate: any = null) : any => {
    if (process.env[key] && process.env[key] !== 'null') return process.env[key];

    if (process.env[alternate] && process.env[alternate] !== 'null') return process.env[alternate];

    return alternate;
};

/**
 * getDir: Get passed dir.
 * @param folder
 * @returns string
 */
const getDir = (folder: string = '') : string => path.resolve(__dirname, '../', folder);

/**
 * baseDir: Get the base dir.
 * @param folder
 * @returns string
 */
const getBaseDir = (folder: string = '') : string => getDir(folder ? `${folder}` : '');

/**
 * verifyFields: Verify if required field is present or if have extra fields.
 * @param requiredFields string[]
 * @param field {}
 * @returns false | string[]
 */
const verifyFields = (requiredFields: string[], fields: {}): false | string[] => {
    let inexistentFields: string[] = [];
    let extraFields: string[] = [];

    requiredFields.forEach((reqField) => {
        if (!(reqField in fields)) inexistentFields.push(reqField);
    })

    if (inexistentFields.length > 0)
        throw new Handler(`missing field(s): ${inexistentFields}`, 1, PRECONDITION_FAILED);

    for(const field in fields)
        if (!requiredFields.includes(field)) extraFields.push(field);

    if (extraFields.length > 0)
        throw new Handler(`remove extra field(s): ${extraFields}`, 2, BAD_REQUEST);

    return false;
}

export {
    autoloadConfig,
    getEnv,
    getDir,
    getBaseDir,
    verifyFields
}
