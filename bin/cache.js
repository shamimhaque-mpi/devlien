import fs from "fs";
import path from "path";
import { base } from "deepline/env";
import System from "../framework/App/Cores/System.js";

export default class Cache {

    constructor(){}

    static async clear(modelName){

        let dir = path.join(process.cwd(), 'node_modules/deepline/framework/App/bootstrap');

        const files = await System.readDirAsync(base.path.join('config'));

        var content   = ``;
        var fileNames = ``;

        Object.values(files).forEach((file)=>{

            let fileName  = file.replace('.js', '');
                // fileName  = fileName.charAt(0).toUpperCase() + fileName.slice(1);
                // fileNames += `  ${file.replace('.js', '')} : (new ${fileName}()),\n`;
                fileNames += `  ${file.replace('.js', '')} : ${fileName},\n`;
            //
            content += `import {${fileName}} from '${base.path.join('config/'+file)}' \n`;
        });

        content += `\n\nexport const configs = {\n${fileNames}}`;
        fs.writeFileSync(path.join(dir, 'config.js'), content);
    }
}