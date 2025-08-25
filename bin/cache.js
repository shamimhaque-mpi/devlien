import fs from "fs";
import path from "path";
import DIR from "../framework/App/Helpers/DIR.js";
import System from "devlien/system";

export default class Cache {

    loaderPath = path.join(process.cwd(), 'node_modules/devlien/utilities/loader.js')

    static async clear(modelName)
    {
        let _this = new this(); 
        //
        await _this.resetLoader();
        await _this.makeConfigCache();
        await _this.updateLoader();
        return 1;
    }



    async makeConfigCache(){
        try{

            let devlienConfig = (await import(path.resolve('devlien.config.js'))).default;
            let baseDir = path.join(process.cwd(), devlienConfig.root);

            let dir = path.join(baseDir, 'bootstrap/cache');

            const config = DIR.path(path.join(dir, 'config.js'));
            await config.make();
            fs.writeFileSync(path.join(dir, 'config.js'), `export const configs = {}`);


            const files = await System.readDirAsync(path.join(baseDir, 'config'));

            var content   = ``;
            var fileNames = ``;

            Object.values(files).forEach((file)=>{

                let fileName  = file.replace('.js', '');
                    fileNames += `  ${file.replace('.js', '')} : ${fileName},\n`;
                //
                content += `import ${fileName} from '${System.toFilePath(path.join(baseDir, 'config/'+file))}';\n`;
            });

            content += `\n\nexport default {\n${fileNames}}`;
            fs.writeFileSync(path.join(dir, 'config.js'), content);
        }
        catch(e){
            console.log(e);
        }
    }



    async resetLoader(){
        const loader = DIR.path(this.loaderPath);
        if(!loader.isExist())
            loader.make();
        
        await loader.makeFile(null, `export default {}`);
    }



    async updateLoader(){
        try {

            let devlienConfig = (await import(path.resolve('devlien.config.js'))).default;
            let baseDir = path.join(process.cwd(), devlienConfig.root);


            const files = await System.readDirAsync(path.join(baseDir, 'bootstrap/cache/'));

            var content   = ``;
            var fileNames = ``;

            Object.values(files).forEach((file)=>{

                let fileName  = file.replace('.js', '');
                    fileNames += `  ${file.replace('.js', '')} : ${fileName},\n`;
                //
                content += `import ${fileName} from '${System.toFilePath(path.join(baseDir, 'bootstrap/cache/'+file))}';\n`;
            });

            content += `\n\nexport default {\n${fileNames}}`;

            fs.writeFileSync(this.loaderPath, content);
        }
        catch(e){
            console.log(e);
        }
    }
}