import fs from "fs";
import { pathToFileURL } from 'url';
import path, { join } from "path";
import { mkdir } from "fs/promises";
import config from "../../../../../devlien.config.js";

export default class DIR 
{
    #dir;
    path;

    constructor(dir=''){
        this.#dir = dir;
    }


    static async copy(source, destination) {
        try {
            fs.cpSync(source, destination, { recursive: true, force: true, errorOnExist: false }, (err) => {
                if (err) throw err;
            });
        } 
        catch (err) {
            throw err;
        }
    }


    static async move(source, destination) {
        try {
            fs.renameSync(source, destination, { recursive: true, force: true, errorOnExist: false }, (err) => {
                if (err) throw err;
            });
        } 
        catch (err) {
            throw err;
        }
    }




    static scan(_path){
        return fs.readdirSync(path.join(process.cwd(), config.root, _path))
    }
    scan(_path=''){
        return fs.readdirSync(path.join(this.path, _path))
    }


    static file(_path){
        const dir = new this();
        dir.path = path.join(process.cwd(), config.root, _path);
        return dir;
    }



    static async import(_path){
        return (await import(pathToFileURL(_path).href));
    }
    async import(_path=''){
        return (await import(pathToFileURL(path.join(this.path, _path)).href));
    }



    static async make(filePath){
        const dirPath = path.dirname(filePath);
        return await fs.mkdir(dirPath, { recursive: true });
    }

    async make(dirPath=null){
        const basPath  = dirPath ? dirPath : this.#dir;
        const basename = path.basename(basPath);
        return await mkdir(basPath.replace(basename ? basename : '', ''), { recursive: true });
    }


    async makeFile(filename=null, content=''){

        filename = filename ? filename : this.filename();
        await this.make();

        let filePath = this.#dir.replace(this.filename(), '');
        filePath = path.join(filePath, filename);
        
        fs.writeFileSync(filePath, content);
    }
        

    filename(isExtension=true){
        if(isExtension)
            return path.basename(this.#dir);
        else {
            return path.basename(this.#dir, path.extname(this.#dir));
        }
    }

    isExist() {
        return fs.existsSync(this.#dir)
    }

    extension(){
        return path.extname(this.#dir);
    }

    static path(path){
        return new this(path);
    }

    static async remove(dirPath){
        try {
            await fs.rm(dirPath, { recursive: true, force: true }, ()=>{

            });
        } catch (err) {
            console.error("Error removing directory:", err);
        }
    }





    static utilities(base=''){
        let dir = new this();
        dir.path = path.join(process.cwd(), 'node_modules/devlien/utilities', base);
        return dir;
    }

    static framework(base=''){
        let dir = new this();
        dir.path = path.join(process.cwd(), 'node_modules/devlien/framework', base);
        return dir;
    }

    static libraries(base=''){
        let dir = new this();
        dir.path = path.join(process.cwd(), 'node_modules/devlien/libraries', base);
        return dir;
    }
}