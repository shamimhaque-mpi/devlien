import fs from "fs";
import path from "path";
import { baseEnv } from "devlien/env";
import System from "devlien/system";
import DIR from "../framework/App/Core/Helpers/DIR.js";

export default class Cache {

    constructor(){}

    static async clear(modelName)
    {
        let dir = path.join(baseEnv.BASE_PATH, 'bootstrap/cache');

        await DIR.path(path.join(dir, 'config.js')).make();

        fs.writeFileSync(path.join(dir, 'config.js'), `export const configs = {}`);

        try{
            const files = await System.readDirAsync(path.join(baseEnv.BASE_PATH, 'config'));

            var content   = ``;
            var fileNames = ``;

            Object.values(files).forEach((file)=>{

                let fileName  = file.replace('.js', '');
                    fileNames += `  ${file.replace('.js', '')} : ${fileName},\n`;
                //
                content += `const ${fileName} = (await import('${System.toFilePath(path.join(baseEnv.BASE_PATH, 'config/'+file))}')).default;\n`;
            });

            content += `\n\nexport const configs = {\n${fileNames}}`;
            fs.writeFileSync(path.join(dir, 'config.js'), content);
        }
        catch(e){
            console.log(e);
        }
    }
}