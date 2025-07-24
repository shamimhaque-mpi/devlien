import fs from "fs";
import path from "path";
import Mysql from "../framework/App/Database/Mysql.js";
import { baseEnv } from "devlien/env";
import System from "devlien/system";
import Model from "devlien/model";

export default class Migration {

    package_path = '';
    app_path = '';


    constructor(){
        this.package_path = path.join(process.cwd(), 'node_modules/devlien');
        this.app_path = process.cwd();
    }

    static async create(name, terminal){

        let mgn   = new Migration;
        let table = (new Migration).getTableName(name);

        const today = (new Date().toISOString().split('T')[0]).split('-').join('_');
        const unixSeconds = Math.floor(Date.now() / 1000);
        const file = `database/migrations/${today+'_'+unixSeconds}_${name}.js`;

        terminal.addLine(`${file} @space generating`);

        var content = fs.readFileSync(mgn.package_path+'/libraries/standard/migration.js', 'utf-8');
            content = content.replaceAll('@table', table)
        fs.writeFileSync(path.join(baseEnv.BASE_PATH, file)  , content);

        terminal.addLine(`${file} @space generated`, 'success');
    }



    static async execute(terminal)
    {
        let migration = new Migration;
        const migrations = await System.readDirAsync(System.path('database/migrations/'));


        try{
            const Dmigrations = await System.readDirAsync(System.vendorPath('framework/App/Database/Default/'));
            for(const index in Dmigrations){
                let migration = new (await System.import(System.vendorPath('framework/App/Database/Default/'+Dmigrations[index])));
                await Mysql.query(migration.build().query().replaceAll('\n', ''));
            }
        }
        catch(e){}


        class Migrations extends Model { constructor(){super({table:'migrations'})}}

        let migrated_list = await Migrations.get();
            migrated_list = Object.values(migrated_list).map(row=>row.path)
        
        let group_no = await Migrations.last();
        group_no = group_no ? group_no.group + 1 : 1;

        for(const index in migrations){
            if(migrated_list.indexOf(migrations[index])<0){
                const path = 'database/migrations/'+migrations[index];
                terminal.addLine(`${path} @space migrating`);
                await migration.runMigration(System.path(path)); 
                await Migrations.instance().create({
                    path  : migrations[index],
                    group : group_no
                });
                terminal.addLine(`${path} @space migrated`, 'success');
            }
        }
        
        process.exit();
    }



    async runMigration(path){

        let migration = new (await System.import(path));
        let init = migration.build();

        let check_query = `
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
            terminal.addLine(`${migrated_list[index]} @space processing`);
            let migration = new (await System.import(System.path('database/migrations/'+migrated_list[index])));
            await Mysql.query(migration.build('down').query().replaceAll('\n', ''));
            await Migrations.where({path:migrated_list[index]}).delete();
            terminal.addLine(`${migrated_list[index]} @space done`, 'success');
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