import Database from "../Database/Mysql.js";
import Relation from "../Eloquent/Relation.js";
import collect from "../Helpers/Collect.js";

export default class Model extends Relation {

    #table      = '';
    #_where     = '';
    #_columns   = ['*'];
    #_orderBy   = '';
    #_join      = '';
    #_skip      = '';
    #_limit     = '';
    #_withSoftDete     = false;


    constructor(config={}){
        super();
            this.#table = config.table ? config.table : this.getTableName();
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
    static where(condition){
        return (new this()).where(condition);
    }




    orderBy(entity, type){
        this.#_orderBy = `ORDER BY ${entity} ${type}`;
        return this;
    }
    static orderBy(entity, type){
        return (new this()).orderBy(entity, type);
    }




    skip(_num=null){
        this.#_skip = _num;
        return this;
    }
    static skip(_num=null){
        return (new this()).skip(_num);
    }




    limit(_num){
        this.#_limit = _num;
        return this;
    }
    static limit(_num){
        return (new this()).limit(_num);
    }





    select(columns) {
        this.#_columns = columns;
        return this;
    }
    static select(columns){
        return (new this()).select(columns);
    }




    async first() {
        try{
            this.#_limit = 1;
            const [records] = await Database.query(this.makeQuery('get'));
            return collect(this.toFormat(records, this.constructor)).first();
        }
        catch(e){
            throw new Error(e);
        }
    }
    static async first(){
        return await (new this()).first();
    }




    async last() {
        try{
            this.orderBy('id', 'DESC');
            this.#_limit = 1;
            const [records] = await Database.instance().query(this.makeQuery('get'));
            return collect(this.toFormat(records, this.constructor)).last();
        }
        catch(e){
            throw new Error(e);
        }
    }
    static async last(){
        return await (new this()).last();
    }




    async get() {
        try{
            var [records] = await Database.query(this.makeQuery('get'));
            return collect(this.toFormat(records, this.constructor));
        }
        catch(e){
            throw new Error(e);
        }
    }
    static async get(){
        return await (new this()).get();
    }
    



    async count(){
        try{
            let [count] = await Database.instance().query(this.makeQuery('count'));
            return count[0].count;
        }
        catch(e){
            throw new Error(e);
        }
    }
    static async count(){
        return await (new this()).count();
    }





    /**
     * Insert multiple records one by one using the create() method.
     * 
     * This method loops through an array of records and inserts each record
     * sequentially by calling the `create()` method for every item.
     * 
     * @param {Array<Object>} records - An array of record objects to insert.
     * @returns {Promise<Object>}
     */
    async create(data) {
        try{
            const columns = Object.keys(data);
            const values  = Object.values(data);
            const _this = new this.constructor;

            const [record] = await Database.query(_this.makeQuery('insert', columns), values);

            let _data = _this.where({'id':record.insertId}).first();

            return _data;
        }
        catch(e){
            throw new Error(e);
        }
    }
    static async create(data){
        return await (new this()).create(data);
    }


    async insert(records){
        for(const record of records){
            await this.create(record);
        }
    }
    static async insert(records){
        return await (new this()).insert(records);
    }


    async update(data={}){
        try{
            await Database.instance().query(this.makeQuery('update', data));
            return await this.first()
        }
        catch(e){
            throw new Error(e);
        }
    }
    static async update(data={}){
        return await (new this()).update(data);
    }



    static async updateOrCreate(where, record){
        let _this = new this();
        const exist = await _this.where(where).first();
        if(exist) {
            return _this.where(where).update(record);
        }
        else {
            return _this.create(record);
        };
    }


    async delete(){
        try{
            if(this.softdelete){
                await this.update({deleted_at:(new Date()).toISOString().split('T')[0]});
            }
            else
                return await Database.instance().query(this.makeQuery('delete'));
        }
        catch(e){
            throw new Error(e);
        }
    }


    static async delete(){
        return await (new this()).delete();
    }


    async truncate(){
        try{
            return await Database.instance().query(`TRUNCATE TABLE ${this.#table};`);
        }
        catch(e){
            throw new Error(e);
        }
    }


    static async truncate(){
        return await (new this()).truncate();
    }


    withSoftDelete(slug=true) {
        this.#_withSoftDete = slug;
        return this;
    }


    static withSoftDelete(slug=true){
        return (new this()).withSoftDelete(slug);
    }


    onlySoftDelete(is=true){
        if(is){
            this.#_withSoftDete = true;
            this.#_where += `${this.#_where?' AND ' : ''} \`${this.#table}\`.deleted_at IS NOT NULL`;
        }
        return this;
    }


    static onlySoftDelete(is=true){
        return (new this()).onlySoftDelete(is);
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

                ${this.#_where?' WHERE '+this.#_where:''} 
                
                ${this.#_orderBy} 

                ${this.#_limit ? ' LIMIT '+this.#_limit : ''}

                ${this.#_skip ? ' OFFSET '+this.#_skip : ''} 
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


    toObject(){
        return Object.assign({}, this);
    }


    getTableName(){
        const constructor = Object.getPrototypeOf(this).constructor;
        return this.pluralize(this.toSnakeCase(constructor.name));
    }


    static instance() {
        return new this();
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
    static join(...fields){
        return (new this()).join(fields);
    }



    static class (){
        return this.namespace + '/' + this.name;
    }

}