export default class router {

    // Internal storage for all route definitions
    _ROUTES = {};
    
    /**
     * Static method to initialize the router and define routes.
     * Accepts a callback function where routes are registered.
     * Returns the instance containing all the defined routes.
     */
    static serve(fn) {
        let route = new router();
        fn(route);
        return route;
    }
    
    /**
     * Registers a GET route.
     * @param {string} path - The route path (e.g., '/users')
     * @param {string} namespace - Controller and method string (e.g., 'UserController@index')
     */
    get(path, namespace) {
        this.routeInit(path, namespace, ['GET']);
    }
    
    /**
     * Registers a POST route.
     * @param {string} path 
     * @param {string} namespace 
     */
    post(path, namespace) {
        this.routeInit(path, namespace, ['POST']);
    }

    /**
     * Registers a PUT route.
     * @param {string} path 
     * @param {string} namespace 
     */
    put(path, namespace) {
        this.routeInit(path, namespace, ['PUT']);
    }

    /**
     * Registers a DELETE route.
     * @param {string} path 
     * @param {string} namespace 
     */
    delete(path, namespace) {
        this.routeInit(path, namespace, ['DELETE']);
    }

    /**
     * Registers a route with multiple HTTP methods.
     * @param {string[]} methods - Array of methods like ['GET', 'POST']
     * @param {string} path 
     * @param {string} namespace 
     */
    match(methods, path, namespace) {
        this.routeInit(path, namespace, methods);
    }

    /**
     * Initializes a route with its metadata.
     * Stores the HTTP methods, controller, method, and middleware for the route.
     * @param {string} path 
     * @param {string} namespace 
     * @param {string[]} methods 
     */
    routeInit(path, namespace, methods) {
        const [controller, method] = namespace.split('@');
        this._ROUTES['/'+path.split('/').filter(e=>e).join('/')] = {
            REQUEST_METHOD: methods,
            METHOD: method,
            CONTROLLER: controller,
            MIDDLEWARE: []
        };
    }

    /**
     * Groups multiple routes under a common prefix or middleware.
     * Accepts config for prefix/middleware and a function that defines the group routes.
     * @param {Object} config - { prefix?: string, middleware?: string[] }
     * @param {Function} fn - Function to define grouped routes
     */
    group(config, fn) {
        let route = new router();
        fn(route); // collect group routes into new instance

        let _PREFIX = '';
        let _ROUTES = {};

        for (const path in route._ROUTES) {
            // Merge middlewares if provided in group config
            if (config.middleware)
                route._ROUTES[path].MIDDLEWARE = [
                    ...route._ROUTES[path].MIDDLEWARE,
                    ...config.middleware
                ];
            if (config.prefix)
                _PREFIX = config.prefix;

            // Build new route path with prefix and clean slashes
            let local_path = '/' + (_PREFIX + '/' + path).split('/').filter(e => e).join('/');
            _ROUTES[local_path] = route._ROUTES[path];
        }

        // Merge the grouped routes into the parent router's routes
        this._ROUTES = Object.assign(this._ROUTES, _ROUTES);
    }
}