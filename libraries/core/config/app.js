import RouteServiceProvider from "../app/Providers/RouteServiceProvider.js"
import env from "devlien/env";

export default {

    name : env('APP_NAME', 'devlien'),
    port : env('PORT', 3000),
    version : '1.0.0',
    timezone : '',
    debug : false,


    /**
     * The service providers to be loaded for the application.
     *
     * @type {Array<class => { register?: () => void }>}
     */
    providers : [
        RouteServiceProvider
    ]
}