import Schema from "./Schema.js";

export default class Migration {
    build(type='up'){
        let schema = new Schema();
        //
        if(type=='up')
            this.up(schema);
        else 
            this.down(schema);
        //
        return schema;
    }
}