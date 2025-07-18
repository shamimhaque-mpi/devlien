import env from "devlien/env";

export default {

    default : env('DB_CONNECTION', 'mysql'),

    connections : {
        mysql : {
            host: env('DB_HOST','127.0.0.1'),
            port: env('DB_PORT', '3306'),
            database: env('DB_NAME'),
            username: env('DB_USERNAME'),
            password: env('DB_PASSWORD'),
        }
    }
}