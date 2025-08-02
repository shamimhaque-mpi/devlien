import route from "devlien/route";

/**
 * Register application routes.
 *
 * This file defines the HTTP routes for the application.
 * Each route maps a URL path to a controller method.
 *
 * Route format: route.get('route-name', 'Controller@method')
 *
 * Example:
 * GET request to '/' will be handled by DevlienController's index() method.
 */

export default route.serve(route => {
    route.get('/', 'DevlienController@wellcome'); 
});