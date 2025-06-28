import fs from "fs";
import path from "path";
import env from "deepline/env";

export default class System {
    base_path = '';
    constructor(config = {path:''}) 
    {
        this.base_path = config.path ? config.path : '';
    }
    

    path($string=""){
        return path.join(env.BASE_PATH, ($string!='' ? (this.base_path+'/'+$string) : this.base_path));
    }


    static path($string=""){
        let obj = new System;
        return path.join(env.BASE_PATH, ($string!='' ? (obj.base_path+'/'+$string) : obj.base_path));
    }


    static vendorPath($string=""){
        return path.join(process.cwd(), 'node_modules/deepline/framework', $string);
    }

    static readDirAsync(dirPath) {
        return new Promise((resolve, reject) => {
            fs.readdir(dirPath, (err, files) => {
                if (err) reject(err);
                else resolve(files);
            });
        });
    }
}