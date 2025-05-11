// const config = require(path("config/app"));
import path from "path";

export default class System {
    base_path = '';
    constructor(config = {path:''}) 
    {
        this.base_path = config.path ? config.path : '';
    }
    

    path($string=""){
        return path.join(process.cwd(), ($string!='' ? (this.base_path+'/'+$string) : this.base_path));
    }
}