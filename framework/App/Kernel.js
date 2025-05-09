const route      = require("./Routes/RouteServe");
const controller = require("./Http/Controllers/Provider");
const glbmdth    = require("./Cores/Global");

module.exports = class 
{
    SERVICES   = {};
    //
    constructor(request, response)
    {
        this.initConfig(request, response);
        //
        this.executeController(response);
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
    executeController(response)
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
            const fedback = (new controller(this.SERVICES)).getResponse();
            if(fedback.then){
                fedback.then(res=>{
                    response.end(res);
                });
            }


            /*********************************************/
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
            system   : new (require("./Cores/System"))()
        }
        //
        this.SERVICES.route = (new route(this.SERVICES)).route();
    }
}