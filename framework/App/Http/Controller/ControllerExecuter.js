import { baseEnv } from "devlien/env";
import System from "devlien/system";
import path from "path";

export default class ControllerExecuter 
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
                
                const controller = await System.import(cltr_path); 
                const base = new (controller)($request);

                if(controller.requestBind && controller.requestBind[route['METHOD']]){
                    await this.validation(controller.requestBind[route['METHOD']], $request, route.PARAMS);
                }
                
                if(!base[route['METHOD']]) throw {
                    message:`${route['METHOD']} function is not found`,
                    data:{controller:"app/Http/Controllers/"+route['CONTROLLER']+'.js'}
                }

                return await base[route['METHOD']]($request, route.PARAMS);
            }
            return false;
        }
        catch(error){
            console.log(error);
            throw {
                status: error.status || 500,
                message: error.message || 'SERVER ERROR',
                errors: error.data || {}
            }
        }
    }

    async validation(ruleResource, request, PARAMS){
        let resources = new ruleResource();
        await request.validate(await resources.rules(request, PARAMS), resources.messages());
    }
}