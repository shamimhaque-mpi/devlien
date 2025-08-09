import Provider from "./Http/Controller/Provider.js"
import RouteServe from "./Route/RouteServe.js"
import System from "./Core/System.js"
import config from "devlien/config";
import colours from "../../utilities/colours.js";
import PublicFile from "./Http/PublicFile.js";
import HTTPHandler from "./Http/Request/HTTPHandler.js";

export default class Kernel 
{
    SERVICES = {};
    ROUTES   = [];
    //
    constructor(request, response=null, config={}){
        return this.executeController(request, response);
    }


    /*
     * ****************
     *
     * ************* */
    async executeController(request, response)
    {
        console.log('url : '+request.url);

        if(PublicFile.hasExtension(request)){
            return await PublicFile.provide(request, response);
        }

        
        await this.initProvider(request, response);
        await this.initConfig(request, response);

        try {

            if(!this.SERVICES.route.METHOD) throw {
                status:"404",
                message:"Not Found"
            };


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
                        let isNext = await middleware.next(request, response);
                        if(isNext!==true){
                            isReturn = isNext;
                            break;
                        }
                    }
                }
                if(isReturn) throw isReturn;
            }

            const feedback = await (new Provider(this.SERVICES)).getResponse(new HTTPHandler(request, response));
            
            //
            if(response){
                let resonseData = "";
                if(feedback.error){
                    throw feedback;
                }
                else if(Buffer.isBuffer(feedback)){
                    resonseData = feedback;
                }
                else if(feedback.viewEngine){
                    resonseData = feedback.html;
                }
                else {
                    response.setHeader('Content-Type', 'application/json');
                    resonseData = JSON.stringify(feedback);
                }
                return response.end(resonseData);
            }
            return feedback;

        }
        catch(err){
            console.log(request.url);
            console.log(colours.text(JSON.stringify(err), 'warning'));
            if(response){
                response.statusCode = err.status||500;
                response.setHeader('Content-Type', 'application/json');
                return response.end(JSON.stringify(err));
            }
            return err;
        }
    }




    async initProvider(request, response){
        let providers = config('app.providers', null);
        if(providers) {
            for(const index in providers){
                var provider = providers[index];
                provider = new provider();
                await provider.boot();
                if(provider.ROUTE_SERVICE){
                    this.ROUTES = [...this.ROUTES, ...provider.ROUTE_SERVICE];
                }
            }
        }      
    }

    /*
     * ***************
     * 
     * ***************/
    async initConfig(request, response)
    {
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