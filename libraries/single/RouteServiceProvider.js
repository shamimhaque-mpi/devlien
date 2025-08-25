import ServiceProvider from "devlien/serviceProvider";
import API from "../../routes/api.js";



export default class RouteServiceProvider extends ServiceProvider {

    constructor(){
        super();
    }

    /**
     * Define your route bindings, pattern filters, and register routes.
     *
     * This method is called after all service providers have been registered,
     * allowing you to define routes or bindings needed by your application.
     */
    async boot(){
        this.route(API);
    }
}