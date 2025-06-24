import fs from "fs";
import path from "path";
import Mysql from "../framework/App/Database/Mysql.js";
import env from "deepline/env";

export default class Migration {

    package_path = '';
    app_path = '';


    constructor(){
        this.package_path = path.join(process.cwd(), 'node_modules/deepline');
        this.app_path = process.cwd();
    }

    static async create(name){

        let mgn = new Migration;

        let table = (new Migration).getTableName(name);

        const today = (new Date().toISOString().split('T')[0]).split('-').join('_');
        const unixSeconds = Math.floor(Date.now() / 1000);

        var content = fs.readFileSync(mgn.package_path+'/libraries/standard/migration.js', 'utf-8');

        content = content.replaceAll('@table', table)


        fs.writeFileSync(path.join(env.BASE_PATH, `database/migrations/${today+'_'+unixSeconds}_${name}.js`)  , content);
    }



    static async execute(){
        let migration = new Migration;
        //
        fs.readdir(path.join(migration.app_path, 'database/migrations/'), (error, files)=>{
            if(!error){
                for(const index in files)
                    migration.runMigration(path.join(migration.app_path, 'database/migrations', files[index]));
            }
        });
        
    }

    async runMigration(path){
        let migration = new (await import(path)).default;
        let dd = await Mysql.instance().query(migration.getQuery().replaceAll('\n', ''));
        console.log(dd);
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