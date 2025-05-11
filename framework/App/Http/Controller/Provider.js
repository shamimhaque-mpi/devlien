export default class Provider 
{
    services;
    constructor($classter)
    {
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
            //
            if(route['CONTROLLER'] && route['METHOD'])
            {
                const cltr_path = system.path("App/Http/Controllers/"+route['CONTROLLER']+'.js');

                const base = new ((await import(cltr_path)).default)($request);

                const resp = await base[route['METHOD']]($request);

                return resp;
            }
            return false;
        }
        catch(error){
            return error.message
        }
    }
}