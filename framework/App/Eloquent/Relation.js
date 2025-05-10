import Database from "../Database/Mysql.js";

export default class Relation {

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

        
        let pid = this['id'];

        class _model {
            async sync(ids=[]){

                let data = [];
                let _pid = pid;

                for(const i in ids){
                    data.push(`(${_pid},${ids[i]})`);
                }

                await Database.instance().query(`DELETE FROM ${pivot_table} WHERE ${pp_id_name} = ${_pid}`);

                await Database.instance().query(`INSERT INTO ${pivot_table} (${pp_id_name}, ${pc_id_name}) VALUES ${data.join(',')};`);
            }    
        }

        return Object.assign((new _model()), {...data});
    }
    


    pluralize(word) {
        if (word.endsWith('y') && !/[aeiou]y$/.test(word)) {
            return word.slice(0, -1) + 'ies';
        }
        if (word.endsWith('s') || word.endsWith('x') || word.endsWith('z') || word.endsWith('ch') || word.endsWith('sh')) {
            return word + 'es';
        }
        return word + 's';
    }




    toSnakeCase(str) {
        return str
          .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
          .toLowerCase()
    }



    
    toSingularize(word) {
        return word
            .split('_')
            .map(part => {
                if (part.endsWith('ies')) {
                    return part.slice(0, -3) + 'y';
                } else if (part.endsWith('es') && !/(ses|xes|zes|ches|shes)$/.test(part)) {
                    return part.slice(0, -1); 
                } else if (part.endsWith('s')) {
                    return part.slice(0, -1);
                }
                return part;
            })
            .join('_');
    }
}