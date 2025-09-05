import { createPool } from 'mysql2/promise';
import config from 'devlien/config';

class DatabaseError extends Error {
    constructor(message) {
        super(message);
        this.name = 'Mysql';
    }
}

export default class Mysql {
    
    #config = {};

    constructor()
    {
        let database = config('database');

        if(database.default && database.connections){
            this.#config = database.connections[database.default];
        }
    }

    static instance (){
        return new Mysql();
    }

    async query(query, values=[]){
        try{
            console.log(query);
            return await this.connect().query(query, values);
        }
        catch(e){
            throw new DatabaseError(e);
        }
    }

    static query(query, values=[]){
        return (new Mysql()).query(query, values);
    }

    connect(database=this.#config.database){
        if(!process.mysql_conn)
            process.mysql_conn = createPool({
                host: this.#config.host,
                user: this.#config.username,
                password: this.#config.password,
                database: database,
                connectTimeout: 3000
            });
        return process.mysql_conn;
    }
}