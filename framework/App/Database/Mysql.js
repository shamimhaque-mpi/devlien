import { createPool } from 'mysql2/promise';
import path  from "path";
import dotenv from "dotenv";


dotenv.config({ path: path.resolve()+'/.env' });



export default class Mysql {
    
    #conn   = new Object();
    #config = {
        db_host: process.env.DB_HOST,
        db_username:process.env.DB_USERNAME,
        db_password:process.env.DB_PASSWORD,
        db_name:process.env.DB_NAME
    };


    constructor(){
        this.#conn = createPool({
            host: this.#config?.db_host,
            user: this.#config?.db_username,
            password: this.#config?.db_password,
            database: this.#config?.db_name,    
        })

    }


    static instance (){
        return new Mysql();
    }



    query(query, values=[]){
        return this.#conn.query(query, values);
    }



    connect(database=this.#config.db_name){
        return this.#conn = createPool({
            host: this.#config.db_host,
            user: this.#config.db_username,
            password: this.#config.db_password,
            database: this.#config.db_name,    
        })
    }
}