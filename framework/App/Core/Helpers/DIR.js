import fs from "fs";
import path from "path";
import { mkdir } from "fs/promises";

export default class DIR 
{
    #dir;
    constructor(dir=''){
        this.#dir = dir;
    }


    static async copy(source, destination) {
        try {
            fs.cp(source, destination, { recursive: true }, (err) => {
                if (err) throw err;
            });
        } catch (err) {
            throw err;
        }
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
}