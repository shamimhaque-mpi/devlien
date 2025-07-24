import { pathToFileURL } from 'url';
import path  from "path";
import dotenv from "dotenv";

const devlienConfig = (await import(pathToFileURL(path.join(process.cwd(), 'devlien.config.js')).href)).default;

dotenv.config({ path: path.resolve()+'/.env' });

export default function(segment=null, _default=null) {
    if(segment)
        return process.env[segment] ? process.env[segment] : _default; 
    return _default; 
}

export const baseEnv = {
    DB_HOST : process.env.DB_HOST,
    DB_USERNAME : process.env.DB_USERNAME,
    DB_PASSWORD : process.env.DB_PASSWORD,
    DB_NAME : process.env.DB_NAME,
    BASE_PATH : path.join(process.cwd(), devlienConfig.root ? devlienConfig.root : ''),
}


export const nodeEnv = process.env;