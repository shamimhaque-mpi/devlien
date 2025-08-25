import fs from "fs";
import path from "path";
import DIR from "devlien/dir";

export default class Migration {

    package_path = '';
    app_path     = '';

    constructor(){
        this.package_path = path.join(process.cwd(), 'node_modules/devlien');
        this.app_path = process.cwd();
    }

    static async create(name, terminal){

        const baseEnv = (await import("devlien/env")).baseEnv;

        let mgn   = new Migration;
        let table = (new Migration).getTableName(name);

        const today = (new Date().toISOString().split('T')[0]).split('-').join('_');
        const unixSeconds = Math.floor(Date.now() / 1000);
        const file = `database/migrations/${today+'_'+unixSeconds}_${name}.js`;

        terminal.addLine(`${file} @space GENERATING`);

        var content = fs.readFileSync(mgn.package_path+'/libraries/standard/migration.js', 'utf-8');
            content = content.replaceAll('@table', table)
        fs.writeFileSync(path.join(baseEnv.BASE_PATH, file)  , content);

        terminal.addLine(`${file} @space GENERATED`, 'success');
    }



    static async execute(terminal)
    {
        try{
            const Mysql = (await import("devlien/database")).default;
            const Model = (await import("devlien/model")).default;
            const migration = new Migration;

            const migrations = DIR.scan('database/migrations');
            const default_migrations = DIR.utilities('migrations').scan();


            for(const index in default_migrations){
                try{
                    var singleMigraion = await DIR.import(DIR.utilities('migrations/'+default_migrations[index]).path);
                        singleMigraion = new singleMigraion.default;

                    await Mysql.query(singleMigraion.build().query().replaceAll('\n', ''));
                }
                catch(error){}
            }

            class Migrations extends Model { constructor(){super({table:'migrations'})}}

            let migrated_list = await Migrations.get();
                migrated_list = Object.values(migrated_list).map(row=>row.path)
            
            let group_no = await Migrations.last();
            group_no = group_no ? group_no.group + 1 : 1;

            for(const index in migrations)
            {
                if(migrated_list.indexOf(migrations[index])<0)
                {
                    const path = DIR.file('database/migrations/'+migrations[index]).path;

                    terminal.addLine(`${path} @space MIGRATING`);
                    await migration.runMigration(path); 

                    await Migrations.create({
                        path  : migrations[index],
                        group : group_no
                    });
                    terminal.addLine(`${path} @space MIGRATED`, 'success');
                }
            }
        }
        catch(e){
            console.log(e);
        }
        process.exit();
    }


    /**
     * Run a migration file and apply schema changes to the database.
     *
     * This method dynamically imports a migration class, initializes
     * its schema definition, checks the existing columns in the
     * database table, and executes the migration queries.
     *
     * @param  {string} path  The absolute path of the migration file.
     * @return {Promise<void>}
     */
    async runMigration(path)
    {
        const migration = new (await DIR.import(path)).default;
        const init      = migration.build();
        const Mysql     = (await import("devlien/database")).default;
        const baseEnv   = (await import('devlien/env')).baseEnv;

        const check_query = `
            SELECT COLUMN_NAME
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = '${baseEnv.DB_NAME}' AND TABLE_NAME = '${init._TABLE}';
        `;

        // 
        var [data] = await Mysql.query(check_query);
            data   = data.map(row=>row.COLUMN_NAME);

        const queries = init.query(data.length ? data : false);
        await Mysql.query(queries.replaceAll('\n', ''));
    }





    static async rollback(param=null, terminal)
    {
        const Mysql = (await import("../framework/App/Database/Mysql.js")).default;
        const Model = (await import("../framework/App/Eloquent/Model.js")).default;
        class Migrations extends Model { constructor(){super({table:'migrations'})}}

        if(param=='--all'){
            var migrated_list = await Migrations.orderBy('id', 'desc').get();
        }
        else {
            let group_no      = (await Migrations.last()).group;
            var migrated_list = await Migrations.where({group:group_no}).get();
        }

        migrated_list = Object.values(migrated_list).map(row=>row.path);


        for(const index in migrated_list)
        {
            terminal.addLine(`${migrated_list[index]} @space PROCESSING`);

            let path = DIR.file('database/migrations/'+migrated_list[index]).path;
            let migration = new (await import(path)).default;
            
            
            await Mysql.query(migration.build('down').query().replaceAll('\n', ''));
            await Migrations.where({path:migrated_list[index]}).delete();
            
            terminal.addLine(`${migrated_list[index]} @space PROCESSED`, 'success');
        }
        
        process.exit();
    }







    getTableName(migrationName) {
        // Remove trailing '_table' if present
        if (migrationName.endsWith('_table')) {
            migrationName = migrationName.slice(0, -6); // Remove "_table"
        }

        const parts = migrationName.split('_');

        // If only one part like "users", return directly
        if (parts.length === 1) {
            return parts[0];
        }

        // If it includes 'in', use the word after 'in' as the table name
        const inIndex = parts.indexOf('in');
        if (inIndex !== -1 && parts[inIndex + 1]) {
            return parts[inIndex + 1];
        }

        // Else, assume last part is the table name
        return parts[parts.length - 1];
    }

}