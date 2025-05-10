import Database from "../Database/Mysql.js";
import Relation from "../Eloquent/Relation.js";

export default class Model extends Relation {

    #table      = '';
    #_where     = '';
    #_columns   = ['*'];
    #_orderBy   = '';
    #_join      = '';
    #_withSoftDete     = false;
    #successFn         = false;


    constructor(){
        super();
        this.#table = this.getTableName();
    }


    getTableName(){
        const constructor = Object.getPrototypeOf(this).constructor;
        return this.pluralize(this.toSnakeCase(constructor.name));
    }


    static instance() {
        return new this();
    }


    where(condition) {

        if(Array.isArray(condition) && condition.length==3)
            this.#_where = this.#_where + (this.#_where?' AND ':'') + `\`${condition[0]}\` ${condition[1]} '${condition[2]}'`;

        else if(!Array.isArray(condition) &&  typeof condition == 'object'){
            let str = [];
            for(const key in condition){

                if(key.split('.').length>1){
                    let _key = key.split('.').map((row)=>`\`${row}\``).join('.');
                    str.push(str.push(`${_key} = '${condition[key]}'`));
                }
                else
                    str.push(`\`${key}\` = '${condition[key]}'`); 
            }
            this.#_where = this.#_where + (this.#_where?' AND ':'') + str.join(' and ');
        }

        return this;
    }


    orderBy(entity, type){
        this.#_orderBy = `ORDER BY ${entity} ${type}`;
        return this;
    }

    //join('t1', 't2', 't1.id', 't2.id')
    join(...fields){

        if(fields.length==3){
            this.#_join += ` ${this.#_join? 'JOIN' : ''} ${fields[0]} ON ${fields[0]}.${fields[1]} = ${this.#table}.${fields[1]}`;
        }
        else {
            this.#_join += ` ${this.#_join? 'JOIN' : ''} ${fields[0]} ON ${fields[0]}.${fields[2]} = ${fields[1]}.${fields[3]}`;
        }
        return this;
    }


    select(columns) {
        this.#_columns = columns;
        return this;
    }



    async first() {
        const [records] = await Database.instance().query(this.makeQuery('get'));
        return records[0] ? this.makeResponse(records[0]) : false;
    }



    async get() {
        var [records] = await Database.instance().query(this.makeQuery('get'));
        records = records.map((record)=>{
            return this.makeResponse(record); ;
        });
        return records;
        
    }



    makeResponse(record){

        let model = this.constructor.name;
        const d   = {[model]:class extends this.constructor { constructor(){super()}}}

        const _dClass = new d[model];
        delete _dClass.softdelete;

        return Object.assign(_dClass, record);
    }
    

    async count(){
        let [count] = await Database.instance().query(this.makeQuery('count'));
        return count[0].count;
    }


    
    async create(data) {
        const columns = Object.keys(data);
        const values  = Object.values(data);
        const [record] = await Database.instance().query(this.makeQuery('insert', columns), values);

        let _data = this.where({'id':record.insertId}).first();

        if(this.#successFn)
            this.#successFn(this.where({'id':record.insertId}), _data);

        return _data;
    }



    async update(data={}){

        await Database.instance().query(this.makeQuery('update', data));
        let _data = this.first()

        if(this.#successFn)
            this.#successFn(this, _data);
        
        return _data;
    }


    async delete(){
        if(this.softdelete){
            await this.update({deleted_at:(new Date()).toISOString().split('T')[0]});
        }
        else
            return await Database.instance().query(this.makeQuery('delete'));
    }


    async truncate(){
        return await Database.instance().query(`TRUNCATE TABLE ${this.#table};`);
    }

    withSoftDelete(slug=true) {
        this.#_withSoftDete = slug;
        return this;
    }


    onlySoftDelete(is=true){
        if(is){
            this.#_withSoftDete = true;
            this.#_where += `${this.#_where?' AND ' : ''} \`${this.#table}\`.deleted_at IS NOT NULL`;
        }
        return this;
    }


    makeQuery(type='get', columns=[]) {

        let query = "";

        if(type=='get'){

            if(this.softdelete && !this.#_withSoftDete){
                this.#_where = this.#_where + `${this.#_where?' AND ':''} \`${this.#table}\`.\`deleted_at\` IS NULL` 
            }

            columns = this.#_columns.join(',');
            query = `
                SELECT 
                    ${columns} 
                
                FROM 
                    ${this.#table} 
                
                ${this.#_join ? 'JOIN '+ this.#_join : ''} 

                ${this.#_where?' where '+this.#_where:''} 
                
                ${this.#_orderBy} 
            `;
        }




        else if(type=='insert')
        {
            const _columns = columns.map(k => `\`${k}\``).join(', ');
            const placeholders = columns.map(() => '?').join(', ');
            query = `INSERT INTO ${this.#table} (${_columns}) VALUES (${placeholders}) ${this.#_where?'where '+this.#_where:''} `;
        }




        else if(type=='update')
        {
            let _columns = []
            
            for(const key in columns) {
                if(key!='created_at' && key!='updated_at'){
                    _columns.push(`\`${key}\`=${columns[key]=='NULL'?'NULL':`'${columns[key]}'`}`)
                }
            };
            
            query = `UPDATE ${this.#table} SET ${_columns.join(',')} ${this.#_where ? 'where '+this.#_where:''}`;
        }


        else if(type == 'delete'){
            query = `DELETE FROM ${this.#table} ${this.#_where ? 'where '+this.#_where:''}`;
        }


        else if(type=='count'){
            query = `SELECT COUNT(*) as count FROM ${this.#table} ${this.#_where ? 'where '+this.#_where:''}`;
        }

        return query.replace(/\s+/g, ' ').trim();
    }


    onSuccess(Fn=null) {
        this.#successFn = Fn;
        return this;
    }

    toObject(){
        return Object.assign({}, this);
    }

}