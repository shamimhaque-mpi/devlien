import Migration from "devlien/migration";

export default class extends Migration {
    up(schema){
        schema.create('migrations', (table)=>{
           table.increments('id');
           table.string('path');
           table.bigInteger('group').default(1);
        });
    }
    down(schema){
        schema.drop('migrations');
    }
}