import Migration from "deepline/migration";

export default class extends Migration {
    up(schema){
        schema.create('@table', (table)=>{
           table.increments('id');
        });
    }
    down(schema){
        schema.drop('@table');
    }
}