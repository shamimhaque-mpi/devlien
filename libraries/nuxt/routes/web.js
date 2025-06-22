import route from "deepline/route";

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
    // Handles GET / → index() method of DeeplineController
    route.get('index', 'DeeplineController@index'); 
});