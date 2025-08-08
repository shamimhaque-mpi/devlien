import fs from "fs";
import path from "path";
import { baseEnv } from "devlien/env";
import DIR from "../framework/App/Core/Helpers/DIR.js";

export default class Request {

    package_path = '';
    app_path = '';


    constructor(){
        this.package_path = path.join(process.cwd(), 'node_modules/devlien');
        this.app_path = process.cwd();
    }


    static async create(modelName, terminal){

        let file = `app/Http/Requests/${modelName}.js`;
        const dir = DIR.path(path.join(baseEnv.BASE_PATH, file));

        if(dir.isExist()){
            console.warn('Request Already Exists');
            return true;
        }

        await dir.make();
        terminal.addLine(`${file} @space GENERATION`);


        var content = fs.readFileSync(path.join(process.cwd(), 'node_modules/devlien', 'libraries/standard/request.js'), 'utf-8');

        content = content.replaceAll('@request', dir.filename(false));
        content = content.replaceAll('@namespace', `"${file.replace('/'+dir.filename(), '')}"`);

        fs.writeFileSync(path.join(baseEnv.BASE_PATH, file), content);

        terminal.addLine(`${file} @space GENERATED`, 'success');
    }
}