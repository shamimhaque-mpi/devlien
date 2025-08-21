import fs from "fs";
import path from "path";
import { baseEnv } from "devlien/env";
import DIR from "../framework/App/Core/Helpers/DIR.js";

export default class Controller {

    package_path = '';
    app_path = '';


    constructor(){
        this.package_path = path.join(process.cwd(), 'node_modules/devlien');
        this.app_path = process.cwd();
    }

    
    static async create(controllerName, terminal){

        let file = `app/Http/Controllers/${controllerName}.js`

        const dir = DIR.path(path.join(baseEnv.BASE_PATH, file));

        if(dir.isExist()){
            console.warn('Controller Already Exists');
            return true;
        }
        dir.make();

        terminal.addLine(`${file} @space GENERATING`);

        let mgn = new Controller;
        var content = fs.readFileSync(mgn.package_path+'/libraries/standard/controller.js', 'utf-8');
        
        content = content.replaceAll('@controller', dir.filename(false));

        fs.writeFileSync(path.join(baseEnv.BASE_PATH, file), content);

        terminal.addLine(`${file} @space GENERATED`, 'success');
    }
}