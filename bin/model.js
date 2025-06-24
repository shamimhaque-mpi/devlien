import fs from "fs";
import path from "path";
import env from "deepline/env";

export default class Migration {

    package_path = '';
    app_path = '';


    constructor(){
        this.package_path = path.join(process.cwd(), 'node_modules/deepline');
        this.app_path = process.cwd();
    }

    static async create(modelName){

        let mgn = new Migration;

        var content = fs.readFileSync(mgn.package_path+'/libraries/standard/model.js', 'utf-8');

        content = content.replaceAll('@model', modelName)

        fs.writeFileSync(path.join(env.BASE_PATH, `app/Models/${modelName}.js`)  , content);
    }
}