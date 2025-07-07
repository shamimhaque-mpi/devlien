import path  from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve()+'/.env' });
// process.env

export default {
    DB_HOST : process.env.DB_HOST,
    DB_USERNAME : process.env.DB_USERNAME,
    DB_PASSWORD : process.env.DB_PASSWORD,
    DB_NAME : process.env.DB_NAME,
    BASE_PATH : path.join(process.cwd(), process.env.SERVER_PATH ? process.env.SERVER_PATH : '')
}



export const base = {
    path : {
        root:path.join(process.cwd(), process.env.SERVER_PATH ? process.env.SERVER_PATH : ''),
        join:(_path)=>path.join(base.path.root, _path),
    }
}