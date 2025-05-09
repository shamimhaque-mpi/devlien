module.exports = class 
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
    async getResponse()
    {
        try {
            let {route, system} = this.services;
            //
            if(route['CONTROLLER'] && route['METHOD'])
            {
                const cltr_path = system.path("App/Http/Controllers/"+route['CONTROLLER']);

                const base = new (require(cltr_path))(this.services);

                const resp = base[route['METHOD']](this.services);

                //
                if(typeof resp == 'string' || typeof resp == 'number'){
                    return await new Promise((resolve, reject)=>{
                        resolve(resp.toString());
                    });
                }
                else {
                    return (resp ? resp : false);
                }
            }
            return false;
        }
        catch(error){
            return await new Promise((resolve, reject)=>{
                resolve(error.message);
            });
        }
    }
}