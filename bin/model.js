import fs from "fs";
import path from "path";
import { baseEnv } from "devlien/env";

export default class Migration {

    package_path = '';
    app_path = '';


    constructor(){
        this.package_path = path.join(process.cwd(), 'node_modules/devlien');
        this.app_path = process.cwd();
    }

    static async create(modelName, terminal){

        let file = `app/Models/${modelName}.js`;
        terminal.addLine(`${file} @space generating`);

        let mgn = new Migration;
        var content = fs.readFileSync(mgn.package_path+'/libraries/standard/model.js', 'utf-8');
        content = content.replaceAll('@model', modelName)
        fs.writeFileSync(path.join(baseEnv.BASE_PATH, file), content);

        terminal.addLine(`${file} @space generated`, 'success');
    }
}