import RouteServiceProvider from "../app/Providers/RouteServiceProvider.js"


export default {

    name : '',
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