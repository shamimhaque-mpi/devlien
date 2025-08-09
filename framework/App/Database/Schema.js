export default class Schema {

    #defaultKeys = [
        'CURRENT_TIMESTAMP',
        'NULL',
    ];
    
    create(table, fn){
        this._PROCESS  = {};
        this._OPERATION = 'create'
        this._TABLE = table;
        fn(this);
    }
    
    update(table, fn){
        this._PROCESS  = {};
        this._OPERATION = 'update'
        this._TABLE = table;
        fn(this);
    }
    
    increments(column){
        this._PROCESS[column] = new Schema();
        this._PROCESS[column]._type = "BIGINT UNSIGNED";
        this._PROCESS[column]._auto_increment = true;
        this._PROCESS[column]._primary_key = 1;
        return this._PROCESS[column];
    }
    
    bigInteger(column) {
        this._PROCESS[column] = new Schema();
        this._PROCESS[column]._type = "BIGINT";
        return this._PROCESS[column];
    }

    unsignedBigInteger(column) {
        this._PROCESS[column] = new Schema();
        this._PROCESS[column]._type = "BIGINT UNSIGNED";
        return this._PROCESS[column];
    }
    
    tinyInt(column, length = 1) {
        this._PROCESS[column] = new Schema();
        this._PROCESS[column]._type = `TINYINT(${length})`;
        return this._PROCESS[column];
    }
    
    string(column, length = 191) {
        this._PROCESS[column] = new Schema();
        this._PROCESS[column]._type = `VARCHAR(${length})`;
        return this._PROCESS[column];
    }
    
    text(column) {
        this._PROCESS[column] = new Schema();
        this._PROCESS[column]._type = 'TEXT';
        return this._PROCESS[column];
    }
    
    
    timestamp(column) {
        this._PROCESS[column] = new Schema();
        this._PROCESS[column]._type = 'DATETIME';
        return this._PROCESS[column];
    }
    
    timestamps() {
        this._PROCESS['created_at'] = new Schema();
        this._PROCESS['created_at']._type = 'DATETIME';
        this._PROCESS['created_at'].nullable().default('CURRENT_TIMESTAMP');

        this._PROCESS['updated_at'] = new Schema();
        this._PROCESS['updated_at']._type = 'DATETIME';
        this._PROCESS['updated_at'].nullable().default(`CURRENT_TIMESTAMP`).onUpdate(`CURRENT_TIMESTAMP`);
    }
    
    softDeletes() {
        this._PROCESS['deleted_at'] = new Schema();
        this._PROCESS['deleted_at']._type = 'DATETIME';
        this._PROCESS['deleted_at'].nullable().default('NULL');
    }

    foreign(column){
        let coln = column;
        column += '_foreign_devlien';
        this._PROCESS[column] = new Schema();
        this._PROCESS[column]._type = `FOREIGN KEY (${coln})`;
        this._PROCESS[column]._foreign_key = true;
        return this._PROCESS[column];
    }
    
    set(column, type){
        this._PROCESS[column] = new Schema();
        this._PROCESS[column]._type = `ENUM(${type.map(e=>`'${e}'`).join(',')})`;
        return this._PROCESS[column];
    }
    
    drop(entity) {
        if(this._PROCESS){
            this._PROCESS[entity] = new Schema();
            this._PROCESS[entity]._drop = entity;
            return this._PROCESS[entity];
        }
        this._query = `DROP TABLE ${entity}`;
        return this;
    }
    
    references(foreign_table){
        this._foreign_table = foreign_table;
        return this;
    }

    on(id){
        this._ref_id = id;
        return this;
    }

    onDelete(delete_method){
        this._dlt_method = delete_method;
        return this;
    }

    rename(name){
        this._rename = name;
        return this;
    }
    
    before(column){
        this._before = column;
        return this;
    }
    
    after(column=null){
        this._after = column;
        return this;
    }

    onUpdate(value){
        if(this.#defaultKeys.includes(value) || Number.isInteger(value))
            this._on_update = value;
        else
            this._on_update = `'${value}'`;
        return this;
    }
    
    nullable(column){
        this._nullable = true;
        return this;
    }
    
    unique(){
        this._unique = true;
        return this;
    }
    
    default(value){
        if(this.#defaultKeys.includes(value) || Number.isInteger(value))
            this._default = value;
        else
            this._default = `'${value}'`;
        return this;
    }
    
    query(fields=null){
        

        if(fields) this._OPERATION = 'update';

        if(!this._PROCESS) return this._query;
        
        let query    = "";
        let entities = [];

        for(let key in this._PROCESS) 
        {
            let column, entity, mod_type, attribute;
            
            entity = this._PROCESS[key];
            key = key.replace('_foreign_devlien', '');


            if(fields && fields.indexOf(key)<0){
                mod_type  = 'ADD COLUMN';
                attribute = (!entity._foreign_key ? `\`${key}\`` : '');
            }
            else if(this._OPERATION=='update'){
                mod_type  = 'CHANGE COLUMN';
                attribute = `\`${key}\` \`${entity._rename ? entity._rename : key }\``;
            }
            else {
                mod_type  = '';
                attribute = (!entity._foreign_key ? `\`${key}\`` : '');
            };

            

            if(!entity._drop){
                column  = `${mod_type} `;
                column += `${attribute} `
                column += `${entity._type}`;
                column += `${(!entity._primary_key && !entity._foreign_key) ? (entity._nullable ? ' NULL' : ' NOT NULL') : ''}`;
                column += `${entity._auto_increment ? ' AUTO_INCREMENT' : ''}`;
                column += `${entity._primary_key ? ' PRIMARY KEY' : ''}`;
                column += `${entity._unique ? ' UNIQUE' : ''}`;
                column += `${entity._default ? ' DEFAULT '+entity._default : ''}`;
                column += `${entity._after ? ' AFTER '+entity._after : ''}`;
                column += `${entity._before ? ' BEFORE '+entity._before : ''}`;
                column += `${entity._drop ? ' DROP COLUMN '+entity._drop : ''}`;
                column += `${entity._foreign_key ? ` REFERENCES ${entity._foreign_table}(${entity._ref_id}) ON DELETE ${entity._dlt_method} ` : ``}`;
                column += `${entity._on_update ? ` ON UPDATE ${entity._on_update}` : ``}`;
            }
            else column = "DROP COLUMN "+entity._drop;
            //
            entities.push(column);
        }
        
        query += (this._OPERATION=='create' ? 'CREATE ' : this._OPERATION=='update'?'ALTER ':'')
        query += `TABLE ${this._TABLE} `;
        query += `${this._OPERATION!='update' ? `(${entities.join(',')})` : entities.join(',')}`; `(\n${entities.join(',\n')} \n)`;
        
        return query;
    }
}