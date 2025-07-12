import { baseEnv } from "deepline/env";
import System from "deepline/system";
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
            let {route, system} = this.services;

            if(route['CONTROLLER'] && route['METHOD']){
                
                const cltr_path = path.join(baseEnv.BASE_PATH, "app/Http/Controllers/"+route['CONTROLLER']+'.js');
                const base = new (await System.import(cltr_path))($request);
                const resp = await base[route['METHOD']]($request, route.PARAMS);

                return resp;
            }
            return false;
        }
        catch(error){
            return error.message
        }
    }
}