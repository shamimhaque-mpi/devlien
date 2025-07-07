import route from "deepline/route";
import Auth from "../app/Http/Middleware/Auth.js";

/**
 * Register application routes.
 *
 * This file defines the HTTP routes for the application.
 * Each route maps a URL path to a controller method.
 *
 * Route format: route.get('route-name', 'Controller@method')
 *
 * Example:
 * GET request to '/' will be handled by DeeplineController's index() method.
 */

export default route.serve(route => {
    route.group({'prefix':'api', 'middleware':[Auth]}, (route)=>{
        route.get('index', 'DeeplineController@index'); 
    })
});