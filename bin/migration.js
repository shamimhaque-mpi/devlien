import fs from "fs";
import path from "path";
import Mysql from "../framework/App/Database/Mysql.js";
import env from "deepline/env";
import System from "../framework/App/Cores/System.js";
import Model from "deepline/model";

export default class Migration {

    package_path = '';
    app_path = '';


    constructor(){
        this.package_path = path.join(process.cwd(), 'node_modules/deepline');
        this.app_path = process.cwd();
    }

    static async create(name){

        let mgn   = new Migration;
        let table = (new Migration).getTableName(name);

        const today = (new Date().toISOString().split('T')[0]).split('-').join('_');
        const unixSeconds = Math.floor(Date.now() / 1000);

        var content = fs.readFileSync(mgn.package_path+'/libraries/standard/migration.js', 'utf-8');
            content = content.replaceAll('@table', table)

        fs.writeFileSync(path.join(env.BASE_PATH, `database/migrations/${today+'_'+unixSeconds}_${name}.js`)  , content);
    }



    static async execute()
    {
        let migration = new Migration;
        const migrations = await System.readDirAsync(System.path('database/migrations/'));


        try{
            const Dmigrations = await System.readDirAsync(System.vendorPath('App/Database/Default/'));
            for(const index in Dmigrations){
                let migration = new (await import(System.vendorPath('App/Database/Default/'+Dmigrations[index]))).default;
                await Mysql.instance().query(migration.getQuery().replaceAll('\n', ''));
            }
        }
        catch(e){}

        class Migrations extends Model { constructor(){super({table:'migrations'})}}

        let migrated_list = await Migrations.instance().get();
            migrated_list = Object.values(migrated_list).map(row=>row.path)
        

        let group_no = await Migrations.instance().last();
        group_no = group_no ? group_no.group + 1 : 1;

        for(const index in migrations){
            if(migrated_list.indexOf(migrations[index])<0){
                await migration.runMigration(System.path('database/migrations/'+migrations[index])); 
                await Migrations.instance().create({
                    path  : migrations[index],
                    group : group_no
                });
            }
        }
        
        process.exit();
    }






    async runMigration(path){
        let migration = new (await import(path)).default;
        //
        console.log(path+'  processing');
        await Mysql.instance().query(migration.getQuery().replaceAll('\n', ''));
        console.log('\x1b[32m%s\x1b[0m', path+'  done');
    }





    static async rollback(param=null)
    {

        const migrations = await System.readDirAsync(System.path('database/migrations/'));
        class Migrations extends Model { constructor(){super({table:'migrations'})}}


        if(param=='--all'){
            var migrated_list = await Migrations.instance().get();
        }
        else {
            let group_no      = (await Migrations.instance().last()).group;
            var migrated_list = await Migrations.instance().where({group:group_no}).get();
        }
        migrated_list = Object.values(migrated_list).map(row=>row.path);



        for(const index in migrated_list){
            
            let migration = new (await import(System.path('database/migrations/'+migrated_list[index]))).default;
            console.log(migrated_list[index]+'  processing');
            await Mysql.instance().query(migration.getQuery('down').replaceAll('\n', ''));
            await Migrations.instance().where({path:migrated_list[index]}).delete();
            console.log('\x1b[32m%s\x1b[0m', migrated_list[index]+'  done');
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