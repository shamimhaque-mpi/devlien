import fs from "fs";
import path from "path";
import { baseEnv } from "deepline/env";
import System from "deepline/system";

export default class Cache {

    constructor(){}

    static async clear(modelName){
        let dir = path.join(process.cwd(), 'node_modules/deepline/framework/App/bootstrap');
        fs.writeFileSync(path.join(dir, 'config.js'), `export const configs = {}`);

        try{
            const files = await System.readDirAsync(path.join(baseEnv.BASE_PATH, 'config'));

            var content   = `import System from "deepline/system";\n\n`;
            var fileNames = ``;

            Object.values(files).forEach((file)=>{

                let fileName  = file.replace('.js', '');
                    fileNames += `  ${file.replace('.js', '')} : ${fileName},\n`;
                //
                content += `const ${fileName} = await System.import('${path.join(baseEnv.BASE_PATH, 'config/'+file)}');\n`;
            });

            content += `\n\nexport const configs = {\n${fileNames}}`;
            fs.writeFileSync(path.join(dir, 'config.js'), content);
        }
        catch(e){
            // console.log(e);
        }
    }
}