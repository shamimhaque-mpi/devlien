import fs from "fs";
import path from "path";
import { baseEnv } from "devlien/env";
import DIR from "../framework/App/Core/Helpers/DIR.js";

export default class Migration {

    package_path = '';
    app_path = '';


    constructor(){
        this.package_path = path.join(process.cwd(), 'node_modules/devlien');
        this.app_path = process.cwd();
    }


    static async create(modelName, terminal){

        let file = `app/Models/${modelName}.js`;
        const dir = DIR.path(path.join(baseEnv.BASE_PATH, file));

        if(dir.isExist()){
            console.warn('Model Already Exists');
            return true;
        }

        await dir.make();
        terminal.addLine(`${file} @space GENERATING`);


        let mgn = new Migration;
        var content = fs.readFileSync(mgn.package_path+'/libraries/standard/model.js', 'utf-8');

        content = content.replaceAll('@model', dir.filename(false));
        content = content.replaceAll('@namespace', `"${file.replace('/'+dir.filename(), '')}"`);

        fs.writeFileSync(path.join(baseEnv.BASE_PATH, file), content);

        terminal.addLine(`${file} @space GENERATED`, 'success');
    }
}