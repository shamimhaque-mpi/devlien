import Migration from "deepline/migration";

export default class extends Migration {
    up(schema){
        schema.create('migrations', (table)=>{
           table.increments('id');
           table.string('path');
           table.bigInt('group').default(1);
        });
    }
    down(schema){
        schema.drop('migrations');
    }
}