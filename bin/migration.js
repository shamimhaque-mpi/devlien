import fs from "fs";
import path from "path";
import Mysql from "../framework/App/Database/Mysql.js";

export default class Migration {

    package_path = '';
    app_path = '';


    constructor(){
        this.package_path = path.join(process.cwd() + 'node_modules/deepline');
        this.app_path = process.cwd();
    }

    static async create(name){

        let mgn = new Migration;

        const today = (new Date().toISOString().split('T')[0]).split('-').join('_');
        const unixSeconds = Math.floor(Date.now() / 1000);

        const content = fs.readFileSync(mgn.package_path+'/libraries/standard/migration.js', 'utf-8');
        fs.writeFileSync(`./database/migrations/${today+'_'+unixSeconds}_${name}.js`, content);
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
}