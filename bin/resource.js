import fs from "fs";
import path from "path";
import { baseEnv } from "devlien/env";

export default class Resource {

    package_path = '';
    app_path = '';

    
    constructor(){
        this.package_path = path.join(process.cwd(), 'node_modules/devlien');
        this.app_path = process.cwd();
    }


    static async create(resourceName, terminal){

        const file = `app/Http/Resources/${resourceName}.js`;

        terminal.addLine(`${file} @space generating`);

        let mgn = new Resource;
        var content = fs.readFileSync(mgn.package_path+'/libraries/standard/resource.js', 'utf-8');
        content = content.replaceAll('@resource', resourceName)
        fs.writeFileSync(path.join(baseEnv.BASE_PATH, file)  , content);

        terminal.addLine(`${file} @space generated`, 'success');
    }
}