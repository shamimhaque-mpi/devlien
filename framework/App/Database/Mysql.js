import { createPool } from 'mysql2/promise';
import config from 'deepline/config';



export default class Mysql {
    
    #conn   = new Object();
    #config = {};


    constructor(){

        let database = config('database');

        if(database.default && database.connections)
            this.#config = database.connections[database.default]


        this.#conn = createPool({
            host: this.#config?.host,
            user: this.#config?.username,
            password: this.#config?.password,
            database: this.#config?.database,    
        })

    }


    static instance (){
        return new Mysql();
    }



    query(query, values=[]){
        return this.#conn.query(query, values);
    }



    connect(database=this.#config.database){
        return this.#conn = createPool({
            host: this.#config.host,
            user: this.#config.username,
            password: this.#config.password,
            database: database,    
        })
    }
}