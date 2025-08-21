import Migration from "devlien/migration";

export default class extends Migration {
    up(schema){
        schema.create('personal_access_tokens', (table)=>{
           table.increments('id');
           table.string('tokenable_type', 255);
           table.unsignedBigInteger('tokenable_id');
           table.text('token');
           table.text('hex');
           table.text('key');
           table.text('iv');
           table.timestamp('last_used_at', 255).nullable();
           table.timestamp('expired_at');
           table.timestamps();
        });
    }
    down(schema){
        schema.drop('personal_access_tokens');
    }
}