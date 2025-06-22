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
}