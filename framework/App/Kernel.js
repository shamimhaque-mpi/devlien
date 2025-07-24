import Provider from "./Http/Controller/Provider.js"
import RouteServe from "./Routes/RouteServe.js"
import {methods} from "./Cores/Global.js"
import System from "./Cores/System.js"
import formidable from 'formidable';
import Request from "./Http/Request.js";
import config from "devlien/config";
import colours from "../../utilities/colours.js";

export default class Kernel 
{
    SERVICES = {};
    ROUTES   = [];
    //
    constructor(request, response=null, config={}){
        return this.executeController(request, response);
    }



    setGlobal(){
        Object.keys(methods).forEach(method_name => {
            global[method_name] = methods[method_name];
        });
    }


    /*
     * ****************
     *
     * ************* */
    async executeController(request, response)
    {
        await this.initProvider(request, response);
        await this.initConfig(request, response);

        try {
            /*
             * ***********************
             *
             * *******************/
            if(this.SERVICES.route.MIDDLEWARE && this.SERVICES.route.MIDDLEWARE.length){
                var isReturn = false;
                for(const index in this.SERVICES.route.MIDDLEWARE){

                    let middleware = this.SERVICES.route.MIDDLEWARE[index];
                    middleware = new middleware();

                    if(middleware){
                        let isNuxt = await middleware.next(request, response);
                        if(isNuxt!==true){
                            isReturn = JSON.stringify(isNuxt);
                            break;
                        }
                    }
                }
                if(response & isReturn)
                    response.end(Buffer.isBuffer(isReturn) ? isReturn : JSON.stringify(isReturn));
                else if(isReturn)
                    return isReturn;
            }

            if(!this.SERVICES.route.METHOD) throw {
                status:"404",
                message:"Not Found"
            };
            /*
             * ***********************
             *
             * *******************/
            
            const form = formidable({ multiples: true });
            var fields;
            var files;
            [fields, files] = await form.parse(request);

            const feedback = await (new Provider(this.SERVICES)).getResponse(Request.instance({
                fields:fields,
                files:files,
                user:false
            }));
            if(response)
                response.end(Buffer.isBuffer(feedback) ? feedback : JSON.stringify(feedback))
            return feedback;
        }
        catch(err){
            
            console.log(colours.text(JSON.stringify(err), 'warning'));

            if(response)
                response.end(JSON.stringify(err));
            return err;
        }
    }




    async initProvider(request, response){
        let providers = config('app.providers', null);
        if(providers) providers.forEach(provider=>{
            provider = new provider();
            provider.boot();
            if(provider.ROUTE_SERVICE){
                this.ROUTES = [...this.ROUTES, ...provider.ROUTE_SERVICE];
            }
        });
    }

    /*
     * ***************
     * 
     * ***************/
    async initConfig(request, response)
    {
        /*
         * ****************************
         * SET ALL GLOBAL FUNCTIONS
         * FROM LIBRARIES
         * ******************* */
        this.setGlobal();

        /*
         * ******************
         * SET ALL SERVICES
         * *************** */
        this.SERVICES = {
            routes   : this.ROUTES,
            request  : request,
            response : response,
            system   : new System()
        }
        //
        this.SERVICES.route = await (new RouteServe(this.SERVICES)).route();
    }
}