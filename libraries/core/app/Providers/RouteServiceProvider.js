import ServiceProvider from "devlien/serviceProvider";
import API from "../../routes/api.js";



export default class RouteServiceProvider extends ServiceProvider {

    constructor(){
        super();
    }


    boot(){
        this.route(API)
    }
}