import fs from "fs";
import path from "path";
import { baseEnv } from "devlien/env";

export default class Controller {

    package_path = '';
    app_path = '';


    constructor(){
        this.package_path = path.join(process.cwd(), 'node_modules/devlien');
        this.app_path = process.cwd();
    }

    
    static async create(controllerName, terminal){

        let file = `app/Http/Controllers/${controllerName}.js`

        terminal.addLine(`${file} @space creating`);

        let mgn = new Controller;
        var content = fs.readFileSync(mgn.package_path+'/libraries/standard/controller.js', 'utf-8');
        content = content.replaceAll('@controller', controllerName)
        fs.writeFileSync(path.join(baseEnv.BASE_PATH, file), content);

        terminal.addLine(`${file} @space created`, 'success');
    }
}