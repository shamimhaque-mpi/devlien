import Schema from "./Schema.js";

export default class Migration {
    getQuery(type='up'){
        let schema = new Schema();
        //
        if(type=='up')
            this.up(schema);
        else 
            this.down(schema);
        //
        return schema.query();
    }
}