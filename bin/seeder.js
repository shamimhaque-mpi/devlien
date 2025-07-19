import System from "devlien/system";
import Database from "devlien/database";
import fs from "fs";
import path from "path";
import { baseEnv } from "devlien/env";

export default class Migration {
    
    static async execute(file=null) {

        try{
            if(!file) file='DatabaseSeeder.js';

            let seeder = await System.import(path.join(baseEnv.BASE_PATH, 'database/seeders/', file));
            await seeder.run(new Database);

            console.log('done');
        }
        catch(e){
            console.log(e);
        }
        
        process.exit();
    }
    
    static async create(name){

        try {

            let path = System.vendorPath('libraries/standard/seeder.js');

            var content = fs.readFileSync(path, 'utf-8');
                content = content.replaceAll('@seeder', name)

            fs.writeFileSync(System.path(`database/seeders/${name}.js`), content);

            console.log(`${name}.js`);
        }
        catch(e){
            console.log(e);
        }
    }
}