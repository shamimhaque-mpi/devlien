import Mysql from "./Mysql.js"
import Model from "devlien/model";

export default class DB {

    static async query(queries){
        return await Mysql.query(queries);
    }

    static table(table){
        return class DB extends Model { constructor(){super({table:table})}}
    }
}