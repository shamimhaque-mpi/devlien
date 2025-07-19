import Migration from "devlien/migration";

export default class extends Migration {
    up(schema){
        schema.create('users', (table)=>{
           table.increments('id');
           table.string('name');
           table.string('username').unique();
           table.string('email').unique();
           table.string('password', 255);
           table.set('status', ['active', 'inactive']).default('active');
        });
    }
    down(schema){
        schema.drop('users');
    }
}