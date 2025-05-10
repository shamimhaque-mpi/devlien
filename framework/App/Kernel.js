// const route      = require("./Routes/RouteServe");
// const controller = require("./Http/Controllers/Provider");
// const glbmdth    = require("./Cores/Global");
import controller from "./Http/Controllers/Provider.js"
import route from "./Routes/RouteServe.js"
import glbmdth from "./Cores/Global.js"
import System from "./Cores/System.js"
import formidable from 'formidable';
import Request from "./Http/Request.js";

export default class Kernel 
{
    
    SERVICES   = {};
    //
    constructor(request, response)
    {
        this.initConfig(request, response);
        //
        this.executeController(request, response);
    }

    setGlobal(){
        Object.keys(glbmdth).forEach(method_name => {
            global[method_name] = glbmdth[method_name];
        });
    }


    /*
     * ****************
     *
     * ************* */
    async executeController(request, response)
    {
        try {
            /*
             * ***********************
             *
             * *******************/
            if(!this.SERVICES.route.PATH) throw {stack:"Page Not Found"};
            /*
             * ***********************
             *
             * *******************/
            
            const form = formidable({ multiples: true });
            var fields;
            var files;
            [fields, files] = await form.parse(request);

            const feedback = await (new controller(this.SERVICES)).getResponse(Request.instance({
                fields:fields,
                files:files,
                user:false
            }));
            response.end(Buffer.isBuffer(feedback) ? feedback : JSON.stringify(feedback))
        }
        catch(err){
            // console.log(err.message, "Message");
            console.log(err.stack, "sssss - stack");
            response.end(err.stack.toString());
        }
    }

    /*
     * ***************
     * 
     * ***************/
    initConfig(request, response)
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
            system   : new System()
        }
        //
        this.SERVICES.route = (new route(this.SERVICES)).route();
    }
}