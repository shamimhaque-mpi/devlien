import Provider from "./Http/Controller/Provider.js"
import RouteServe from "./Routes/RouteServe.js"
import {methods} from "./Cores/Global.js"
import System from "./Cores/System.js"
import formidable from 'formidable';
import Request from "./Http/Request.js";

export default class Kernel 
{
    
    SERVICES   = {};
    #PATH
    //
    constructor(request, response=null, config={})
    {
        this.#PATH = config.path;
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

        await this.initConfig(request, response);

        try {
            /*
             * ***********************
             *
             * *******************/
            if(this.SERVICES.route.MIDDLEWARE && this.SERVICES.route.MIDDLEWARE.length){
                for(const index in this.SERVICES.route.MIDDLEWARE){
                    let middleware = this.SERVICES.route.MIDDLEWARE[index];

                    middleware = new middleware();
                    if(middleware.next){
                        await middleware.next(request, response);
                    }
                }
            }



            if(!this.SERVICES.route.PATH) throw {stack:"Page Not Found"};
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
            console.log(err.stack, "sssss - stack");
            if(response)
                response.end(err.stack.toString());
            return err.stack;
        }
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
            request  : request,
            response : response,
            system   : new System({path:this.#PATH})
        }
        //
        this.SERVICES.route = await (new RouteServe(this.SERVICES)).route();
    }
}