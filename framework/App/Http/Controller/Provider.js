import { baseEnv } from "devlien/env";
import System from "devlien/system";
import path from "path";

export default class Provider 
{
    services;
    constructor($classter){
        this.services = $classter;
    }


    /*
     * *********
     *
     * *************** */
    async getResponse($request)
    {
        try {
            let { route } = this.services;

            if(route['CONTROLLER'] && route['METHOD']){
                const cltr_path = path.join(baseEnv.BASE_PATH, "app/Http/Controllers/"+route['CONTROLLER']+'.js');
                const base = new (await System.import(cltr_path))($request);
                return await base[route['METHOD']]($request, route.PARAMS);
            }
            return false;
        }
        catch(error){
            return error.message
        }
    }
}