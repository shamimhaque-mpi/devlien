import System from "devlien/system";
import Database from "devlien/database";
import fs from "fs";
import path from "path";
import { baseEnv } from "devlien/env";

export default class Seeder {
    
    static async execute(file=null, terminal) {

        try{
            if(!file) file='DatabaseSeeder.js';
            terminal.addLine('database/seeders/'+file+' @space PROCESSING');
            let seeder = await System.import(path.join(baseEnv.BASE_PATH, 'database/seeders/', file));
            await seeder.run(new Database);
            terminal.addLine('database/seeders/'+file+' @space PROCESSED', 'success');
        }
        catch(e){
            console.log(e);
        }
        
        process.exit();
    }
    
    static async create(name, terminal){

        try {

            const file = `database/seeders/${name}.js`

            terminal.addLine(`${file} @space GENERATING`);

            let path = System.vendorPath('libraries/standard/seeder.js');

            var content = fs.readFileSync(path, 'utf-8');
                content = content.replaceAll('@seeder', name)

            fs.writeFileSync(System.path(file), content);

            terminal.addLine(`${file} @space GENERATED`, 'success');
        }
        catch(e){
            console.log(e);
        }
    }
}