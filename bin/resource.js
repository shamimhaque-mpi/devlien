import fs from "fs";
import path from "path";
import env from "deepline/env";

export default class Resource {

    package_path = '';
    app_path = '';

    
    constructor(){
        this.package_path = path.join(process.cwd(), 'node_modules/deepline');
        this.app_path = process.cwd();
    }


    static async create(resourceName){
        let mgn = new Resource;
        var content = fs.readFileSync(mgn.package_path+'/libraries/standard/resource.js', 'utf-8');
        content = content.replaceAll('@resource', resourceName)
        fs.writeFileSync(path.join(env.BASE_PATH, `app/Http/Resources/${resourceName}.js`)  , content);
    }
}