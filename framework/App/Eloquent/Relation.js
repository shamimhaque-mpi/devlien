import Facade from "./Facade.js";
import Database from "../Database/Mysql.js";
import { baseEnv } from "devlien/env";
import path from "path";

export default class Relation extends Facade {

    async hasMany(model, forein_key, local_key){
        return await model.instance().where(forein_key, this[local_key]).get();
    }

    async hasOne(model, forein_key, local_key){
        return await model.instance().where(forein_key, this[local_key]).first();
    }


    
    async manyToMany(model){

        let parent_table = this.getTableName();
        let child_table  = model.instance().getTableName();

        let pivot_table  = this.toSingularize(parent_table)+'_'+child_table;

        let pp_id_name = this.toSingularize(parent_table)+'_id';
        let pc_id_name = this.toSingularize(child_table)+'_id';


        let [data] = await Database.instance().query(`
            SELECT * FROM ${child_table} WHERE id IN (
                SELECT ${pc_id_name} FROM ${pivot_table} WHERE ${pp_id_name} = ${this['id']}
            )
        `);

        let className = new model().constructor.name;
        let modelPath = path.join(baseEnv.BASE_PATH, model.namespace, className+'.js');

        let newModel = new Function(`
            return async ()=>{

                let model = (await import('${modelPath}')).default;
                let Database = (await import('devlien/database')).default;

                class relationable extends model {};

                return class ${className} extends relationable {
                    async sync(ids){
                        let data = [];
                        let _pid = ${this['id']};

                        for(const i in ids){
                            data.push('('+_pid+' ,'+ids[i]+')');
                        }

                        await Database.query('DELETE FROM ${pivot_table} WHERE ${pp_id_name} = '+_pid);
                        await Database.query('INSERT INTO ${pivot_table} (${pp_id_name}, ${pc_id_name}) VALUES '+(data.join(',')));
                    } 
                };
            }
        `)();

        newModel = (await newModel());
        return this.toFormat(data, newModel, new newModel, model.hidden);
    }



    async morphTo(_type=null, _id=null, _entity=null){
        try{

            var {type, id} = this.makeMorphFields(this.constructor.name);

            if(_type) type = _type;
            if(_id) id = _id;

            const model = (await import(path.resolve(this[type]+'.js'))).default;
            return await model.where({[_entity?_entity:'id']:this[id]}).first();
        }
        catch(e){
            console.log(e);
            throw e;
        }
    }


    async morphMany(_class, _type){
        try{
            const model = (await import(path.resolve(_class+'.js'))).default;
            return await model.where({[_type+'_type']:this.constructor.class()}).where({[_type+'_id']:this.id}).get();
        }
        catch(error){
            console.log(error);
            throw error;
        }
    }
}