
import * as fs from 'fs';
import path from 'path';


export default class FileHandler {
    #file;
    #successFn;

    constructor(file){
        this.#file = file;
        return this;
    }


    async upload(route="", name=''){

        return new Promise((resolve, reject) => {

            if (!this.#file || !this.#file.filepath || !this.#file.originalFilename) {
                return reject(new Error('Invalid file input'));
            }


            const uploadDir = path.join(process.cwd(), 'storage/public', route);
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }


            const newFileName = name ? name+path.extname(this.#file.originalFilename) : (Date.now()+"-"+(Math.floor(Math.random() * 10000))) + path.extname(this.#file.originalFilename);
            const targetPath = path.join(uploadDir, newFileName);


            fs.copyFile(this.#file.filepath, targetPath, (err) => {
                fs.unlink(this.#file.filepath, () => {});
            });

            let $main_path = `/api/file/storage/public/${route+'/'+newFileName}`;

            if(this.#successFn) this.#successFn($main_path)
            resolve($main_path);

        });
    }


    static file (file){
        return new FileHandler(file);
    }


    static instance(file=null) {
        return new this(file);
    }


    async delete(_path){
        if(_path)
        return new Promise((resolve, reject)=>{
            
            let isFile = fs.existsSync(path.join(process.cwd(), _path));

            if(!isFile) {
                return resolve({success:false});
            }
            
            fs.unlink(path.join(process.cwd(), _path), (error)=>{
                if(this.#successFn)
                    this.#successFn({success:true});
                return resolve({success:true});
            });

        });
    }


    onSuccess(Fn=null) {
        this.#successFn = Fn;
        return this;
    }
}