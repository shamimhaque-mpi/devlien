import Migration from "devlien/migration";

export default class extends Migration {
    up(schema){
        schema.create('@table', (table)=>{
           table.increments('id');
           table.timestamps();
        });
    }
    down(schema){
        schema.drop('@table');
    }
}